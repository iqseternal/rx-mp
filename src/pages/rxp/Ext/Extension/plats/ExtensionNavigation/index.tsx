import { App, Empty, Layout, Menu, Skeleton, Tooltip } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, type Key } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { navCssTransitionClassNames } from './definition';
import { useAsyncEffect, useShallowReactive, useTransition as useRXTransition } from '@/libs/hooks';
import { getExtensionGroupListApi, getExtensionListApi } from '@/api/modules';
import type { GetExtensionListApiStruct } from '@/api/modules';
import { isNumber, toNil, toWaitPromise } from '@suey/pkg-utils';
import { classnames } from '@/libs/common';
import { toBizErrorMsg } from '@/error/code';
import { useExtensionStatusStore } from '../../store/useExtensionStatusStore';
import { useLocation } from 'react-router-dom';
import { animated, useTransition } from '@react-spring/web';
import { useNormalState, useSyncState } from '@/libs/hooks/useReactive';
import type { ItemType } from 'antd/es/menu/interface';

import IconFont from '@/components/IconFont';
import styles from './index.module.scss';
import Widget from '@/components/Widget';

interface ExtensionDeleteWidgetProps {
  row: GetExtensionListApiStruct;
  /**
   * 删除成功
   */
  onSuccess?: () => void;
}

const ExtensionDeleteWidget = memo<ExtensionDeleteWidgetProps>((props) => {
  const { row, onSuccess } = props;
  const { message, modal } = App.useApp();

  const [extensionDeleting, deleteExtension] = useRXTransition(async () => {
    // const [err, res] = await toNil(deleteExtensionGroupApi({
    //   extension_group_id: row.extension_group_id,
    //   extension_group_uuid: row.extension_group_uuid
    // }));

    // if (err) {
    //   message.error(toBizErrorMsg(err.reason, `删除扩展组 ${row.extension_group_name} 失败`));
    //   shallowState.isDeleting = false;
    //   return;
    // }

    message.success(`删除扩展 ${row.extension_name} 成功`);
    onSuccess && onSuccess();
  }, []);

  return (
    <Widget
      icon='DeleteOutlined'
      className='text-red-500'
      tipText='删除扩展'
      loading={extensionDeleting.pending}
      onClick={async () => {
        modal.confirm({
          title: '是否确认删除?',
          okText: '删除',
          cancelText: '取消',
          okButtonProps: {
            icon: <IconFont icon='DeleteOutlined' />,
            type: 'primary',
            danger: true,
          },
          cancelButtonProps: {
            icon: <IconFont icon='RollbackOutlined' />,
            type: 'default'
          },
          onOk: deleteExtension,
          onCancel: () => {

          }
        })
      }}
    />
  )
})

interface ExtensionMenuIconProps {
  row: GetExtensionListApiStruct;
}

const ExtensionMenuIcon = memo<ExtensionMenuIconProps>((props) => {
  const { row } = props;

  const widgetIcon = row.enabled === 1 ? (isNumber(row.use_version) ? 'CheckCircleOutlined' : 'IssuesCloseOutlined') : 'StopOutlined';
  const widgetTipText = row.enabled === 1 ? (isNumber(row.use_version) ? '已启用' : '已启用、但版本无效') : '未启用';

  return (
    <IconFont
      icon={widgetIcon}
    />
  )
})

interface ExtensionExtraProps {
  row: GetExtensionListApiStruct;
  className?: string;
}

const ExtensionExtra = memo<ExtensionExtraProps>((props) => {
  const { row, className } = props;

  return (
    <div
      className={className}
    >
      <IconFont
        icon='StopTwoTone'
      />
    </div>
  )
})

interface ExtensionMenuLabelProps {
  row: GetExtensionListApiStruct;
}

const ExtensionMenuLabel = memo<ExtensionMenuLabelProps>((props) => {
  const { row } = props;

  return (
    <div
      className='flex justify-between items-center'
    >
      <span>{row.extension_name}</span>

      <ExtensionExtra
        row={row}
        className='hidden'
      />
    </div>
  )
})

export const ExtensionNavigation = memo(forwardRef<HTMLDivElement>(() => {
  const { message } = App.useApp();

  const [normalState] = useNormalState(() => ({
    extensionIdMap: new Map<number, GetExtensionListApiStruct>()
  }))
  const [shallowState] = useShallowReactive(() => ({
    extensionList: [] as GetExtensionListApiStruct[],
    extensionListLoading: false,
  }))

  const [syncStoreState] = useSyncState(() => ({
    selectedExtensionGroup: useExtensionStatusStore(store => store.selectedExtensionGroup),
    selectedExtension: useExtensionStatusStore(store => store.selectedExtension)
  }))

  const loadExtensionList = useCallback(async () => {
    // 扩展组无效
    if (!syncStoreState.selectedExtensionGroup) return;

    if (shallowState.extensionListLoading) return;
    shallowState.extensionListLoading = true;

    const extensionGroupId = syncStoreState.selectedExtensionGroup.extension_group_id;

    const [err, res] = await toNil(getExtensionListApi({
      extension_group_id: extensionGroupId,
      page: 1,
      page_size: 10,
    }));

    if (err) return;

    if (!syncStoreState.selectedExtensionGroup) return;
    if (extensionGroupId !== syncStoreState.selectedExtensionGroup.extension_group_id) return;

    shallowState.extensionList = res.data.list;
    for (let i = 0; i < res.data.list.length; i++) {
      const extension = res.data.list[i];
      if (extension) {
        normalState.extensionIdMap.set(extension.extension_id, extension);
      }
    }

    if (!syncStoreState.selectedExtension) {
      if (res.data.list.length !== 0) {
        useExtensionStatusStore.setState({
          selectedExtension: res.data.list[0]
        })
      }
    }
    shallowState.extensionListLoading = false;
  }, []);


  useAsyncEffect(async () => {
    const search = new URLSearchParams(window.location.search);
    const extensionGroupId = Number(search.get('extension_group_id'));

    if (Number.isNaN(extensionGroupId)) return;

    if (extensionGroupId) {
      const [err, res] = await toNil(getExtensionGroupListApi({
        extension_group_id: extensionGroupId,
        page_size: 1
      }))

      if (err) return;

      if (res.data?.list.length > 0) {
        useExtensionStatusStore.setState({
          selectedExtensionGroup: res.data.list[0]
        })
      }
    }
  }, []);

  useAsyncEffect(async () => {
    normalState.extensionIdMap.clear();
    shallowState.extensionList = [];
    shallowState.extensionListLoading = false;
    await loadExtensionList();
  }, [syncStoreState.selectedExtensionGroup]);

  return (
    <Layout.Sider
      theme='light'
      className='w-full h-full sticky top-0 z-20'
      collapsible={false}
      breakpoint='xl'
    >
      <div
        className='w-full h-full px-0.5 flex flex-col overflow-y-hidden overflow-x-hidden'
      >
        <Skeleton
          active
          loading={shallowState.extensionListLoading}
          paragraph={{
            rows: 21,
            width: 180
          }}
        >
          <div
            className='w-full h-11 flex-none'
          >

          </div>

          <div
            className='h-full overflow-y-auto'
          >
            {shallowState.extensionList.length === 0 ? (
              <Empty
                description='<空>'
              />
            ) : (
              <Menu
                selectedKeys={syncStoreState.selectedExtension ? [String(syncStoreState.selectedExtension.extension_id)] : []}
                className={styles.extensionGroupNavMenu}
                items={shallowState.extensionList.map((item): ItemType => {

                  return {
                    label: (<ExtensionMenuLabel row={item} />),
                    key: item.extension_id,
                    type: 'item',
                    icon: (<ExtensionMenuIcon row={item} />)
                  }
                })}
                onSelect={({ selectedKeys, key, keyPath }) => {
                  const extensionId = Number(key);
                  if (Number.isNaN(extensionId)) return;

                  useExtensionStatusStore.setState({ selectedExtension: normalState.extensionIdMap.get(extensionId) ?? void 0 });
                }}
              />
            )}
          </div>
        </Skeleton>
      </div>
    </Layout.Sider>
  )
}))

export const ExtensionNavigationWrapper = (() => {
  const location = useLocation();
  const isInternalNav = location.pathname === '/rxp/ext/extension';

  const transitions = useTransition(isInternalNav, {
    keys: isInternalNav ? 'internal_nav' : 'not_internal_nav',
    from: {
      opacity: 0,
      transform: 'translateX(-20px)',
      width: '0%',
      maxWidth: 0,
    },
    enter: {
      opacity: 1,
      transform: 'translateX(0%)',
      maxWidth: 1000
    },
    leave: {
      opacity: 0,
      transform: 'translateX(20px)',
      width: '0%',
      maxWidth: 0,
    },
    config: {
      duration: 300,
      easing: t => t * (2 - t)
    },
    exitBeforeEnter: true
  });

  return transitions((style, item) => (
    <animated.div
      style={{
        ...style,
        willChange: 'transform, opacity, width'
      }}
      className='h-full z-20'
    >
      {item && (
        <ExtensionNavigation />
      )}
    </animated.div>
  ))
})

export default ExtensionNavigationWrapper;

