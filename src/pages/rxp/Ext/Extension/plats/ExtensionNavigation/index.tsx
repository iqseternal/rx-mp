import { App, Empty, Layout, Menu, Skeleton } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, type Key } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { navCssTransitionClassNames } from './definition';
import { useAsyncEffect, useShallowReactive, useTransition as useRXTransition } from '@/libs/hooks';
import { getExtensionGroupListApi, getExtensionListApi, type GetExtensionGroupListApiResponse, type GetExtensionListApiResponse } from '@/api/modules';
import { toNil, toWaitPromise } from '@suey/pkg-utils';
import { classnames } from '@/libs/common';
import { toBizErrorMsg } from '@/error/code';
import { useExtensionStatusStore } from '../../store/useExtensionStatusStore';
import { useLocation } from 'react-router-dom';
import { animated, useTransition } from '@react-spring/web';
import { useSyncNormalState } from '@/libs/hooks/useReactive';

import IconFont from '@/components/IconFont';
import styles from './index.module.scss';
import Widget from '@/components/Widget';

const ExtensionDeleteWidget = memo(({ row, onSuccess }: { row: GetExtensionListApiResponse; onSuccess: () => void; }) => {
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

export const ExtensionNavigation = memo(forwardRef<HTMLDivElement>(() => {
  const { message } = App.useApp();

  const [shallowState] = useShallowReactive(() => ({
    extensionList: [] as GetExtensionListApiResponse[],
    extensionListLoading: false,
  }))

  const [syncStoreState] = useSyncNormalState(() => ({
    selectedExtensionGroupId: useExtensionStatusStore(store => store.selectedExtensionGroupId),
    selectedExtensionId: useExtensionStatusStore(store => store.selectedExtensionId)
  }))

  const loadExtensionList = useCallback(async () => {
    if (shallowState.extensionListLoading) return;
    shallowState.extensionListLoading = true;

    const selectedExtensionGroupId = syncStoreState.selectedExtensionGroupId;
    const extension_group_id = Number(selectedExtensionGroupId);

    const [err, res] = await toNil(getExtensionListApi({
      extension_group_id: Number.isNaN(extension_group_id) ? void 0 : extension_group_id,
      page: 1,
      page_size: 10,
    }));

    if (err) return;
    if (selectedExtensionGroupId !== syncStoreState.selectedExtensionGroupId) return;

    shallowState.extensionList = res.data.list;
    shallowState.extensionListLoading = false;
  }, []);

  useAsyncEffect(async () => {
    shallowState.extensionList = [];
    shallowState.extensionListLoading = false;
    await loadExtensionList();
  }, [syncStoreState.selectedExtensionGroupId]);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const extensionGroupId = search.get('extension_group_id');
    if (extensionGroupId) {
      useExtensionStatusStore.setState({ selectedExtensionGroupId: extensionGroupId })
    }
  }, []);

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
                selectedKeys={syncStoreState.selectedExtensionId ? [syncStoreState.selectedExtensionId] : []}
                className={styles.extensionGroupNavMenu}
                items={shallowState.extensionList.map(item => ({

                  label: item.extension_name,
                  key: item.extension_id,

                  onClick: () => {
                    useExtensionStatusStore.setState({ selectedExtensionId: `${item.extension_id}` })
                  }
                }))}
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

