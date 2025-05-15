import { metadata } from '@/libs/rxp-meta';
import { Alert, App, Button, Card, Space, Switch, Table, Tabs, Timeline, Row, Spin, Skeleton } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ExtensionGroupModalInstance } from '../ExtensionGroup/mods/ExtensionGroupModal';
import type { TableRef } from 'antd/es/table';
import { ModalMode } from '@/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAsyncEffect, useRefresh, useShallowReactive, useTransition } from '@/libs/hooks';
import { usePaginationAttrs, useTableAttrs } from '@/libs/hooks/useAttrs';
import { editExtensionApi, getExtensionListApi, getExtensionVersionListApi } from '@/api/modules';
import type { GetExtensionListApiResponse, GetExtensionListApiStruct, GetExtensionVersionListApiStruct } from '@/api/modules';
import { toNil } from '@suey/pkg-utils';
import Icon, { ClearOutlined, ClockCircleOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { toBizErrorMsg } from '@/error/code';
import { useExtensionStatusStore } from './store/useExtensionStatusStore';
import { useSyncState } from '@/libs/hooks/useReactive';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@uiw/react-codemirror';
import { extensionSwitchCssTransitionClassNames } from './definition';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import { ExtensionModal } from './mods/ExtensionModal';
import type { ExtensionVersionModalInstance } from './mods/ExtensionVersionModal';
import { ExtensionVersionModal } from './mods/ExtensionVersionModal';

import Ellipsis from '@/components/Ellipsis';
import Widget from '@/components/Widget';
import moment from 'moment';
import ExtensionNavigationWrapper from './plats/ExtensionNavigation';
import IconFont from '@/components/IconFont';
import RXUI from '@/b-components/RXUI';
import TabPane from 'antd/es/tabs/TabPane';
import ReactCodeMirror from '@uiw/react-codemirror';

interface ExtensionEnabledSwitchProps {
  extension: GetExtensionListApiStruct;
}

const ExtensionEnabledSwitch = memo<ExtensionEnabledSwitchProps>((props) => {
  const refresh = useRefresh();

  const { message } = App.useApp();

  const [syncPropsState] = useSyncState(() => ({
    extension: props.extension
  }))

  const [extensionEnabledChanging, changeExtensionEnabled] = useTransition(async () => {
    const enabled = syncPropsState.extension.enabled;

    const nextEnabled = enabled === 1 ? 0 : 1;

    const [err, res] = await toNil(editExtensionApi({
      extension_id: syncPropsState.extension.extension_id,
      extension_uuid: syncPropsState.extension.extension_uuid,
      enabled: nextEnabled
    }))

    if (err) {
      message.error(toBizErrorMsg(err.reason, '扩展组切换启用状态失败'));
      return;
    }
  }, []);

  useEffect(() => {




  }, []);

  return (
    <Switch
      value={syncPropsState.extension.enabled === 1}
      checkedChildren='已启用'
      loading={extensionEnabledChanging.pending}
      unCheckedChildren='未启用'
      onClick={changeExtensionEnabled}
    />
  )
})

const Extension = memo(forwardRef<HTMLDivElement>((props, ref) => {
  const navigate = useNavigate();

  const extensionVersionModalRef = useRef<ExtensionVersionModalInstance>(null);

  const { message, modal } = App.useApp();

  const [syncStoreState] = useSyncState(() => ({
    selectedExtensionGroup: useExtensionStatusStore(store => store.selectedExtensionGroup),
    selectedExtensionGroupLoading: useExtensionStatusStore(store => store.selectedExtensionGroupLoading),

    selectedExtension: useExtensionStatusStore(store => store.selectedExtension),
    selectedExtensionLoading: useExtensionStatusStore(store => store.selectedExtensionLoading),
  }))

  const [shallowState] = useShallowReactive(() => ({
    extensionVersionList: [] as GetExtensionVersionListApiStruct[],
    extensionVersionListLoading: false,

    selectedExtensionVersion: void 0 as (undefined | GetExtensionVersionListApiStruct)
  }))

  const loadData = useCallback(async () => {
    if (!syncStoreState.selectedExtension) return;

    const extensionId = syncStoreState.selectedExtension.extension_id;
    const extensionUuid = syncStoreState.selectedExtension.extension_uuid;

    shallowState.extensionVersionList = [];
    shallowState.extensionVersionListLoading = true;
    shallowState.selectedExtensionVersion = void 0;

    const [err, res] = await toNil(getExtensionVersionListApi({
      extension_id: extensionId,
      extension_uuid: extensionUuid,
      page_size: 10
    }))

    if (
      extensionId !== syncStoreState.selectedExtension?.extension_id ||
      extensionUuid !== syncStoreState.selectedExtension?.extension_uuid
    ) return;

    if (err) {
      message.error(toBizErrorMsg(err.reason, `获取扩展 ${extensionId} 版本列表失败`));
      shallowState.extensionVersionListLoading = false;
      return;
    }

    shallowState.extensionVersionList = res.data.list;
    shallowState.extensionVersionListLoading = false;

    if (!shallowState.selectedExtensionVersion) {
      const firstVersion = res.data.list[0];
      if (firstVersion) {
        shallowState.selectedExtensionVersion = firstVersion;
      }
    }
  }, []);

  useAsyncEffect(loadData, [syncStoreState.selectedExtension]);

  return (
    <div
      ref={ref}
    >
      <Skeleton
        loading={syncStoreState.selectedExtensionGroupLoading || syncStoreState.selectedExtensionLoading}
      >
        {syncStoreState.selectedExtension && (
          <Alert
            type='info'
            showIcon
            className='mb-2'
            message={(
              <div>
                <Space>
                  <span>
                    {syncStoreState.selectedExtension.extension_id}
                  </span>

                  <span>
                    {syncStoreState.selectedExtension.extension_name}
                  </span>

                  <ExtensionEnabledSwitch
                    extension={syncStoreState.selectedExtension}
                  />
                </Space>
              </div>
            )}
          />
        )}

        <Card>
          <div
            className='w-full flex justify-between items-center mb-4'
          >
            <Space>
              <Button
                type='primary'
                icon={(
                  <IconFont icon='FolderAddOutlined' />
                )}
                onClick={() => {
                  extensionVersionModalRef.current?.open(ModalMode.Create);
                }}
              >
                创建版本
              </Button>
            </Space>
            <div>

            </div>
          </div>

          <div
            className='w-full flex justify-between items-start gap-x-3'
          >
            <Timeline
              items={shallowState.extensionVersionList.map((extensionVersion) => {
                let color = 'blue';

                const version = (() => {
                  const v = Number(extensionVersion.version);
                  if (Number.isNaN(v)) return 1;
                  return v;
                })()

                if (syncStoreState.selectedExtension?.use_version === version) {
                  color = 'green';
                }

                return {
                  dot: (
                    <IconFont
                      icon='CrownOutlined'
                    />
                  ),
                  color: color,
                  children: (
                    <div
                      className=''
                    >
                      <div className='flex justify-between items-start'>
                        <span>V{extensionVersion.version}</span>
                        <Widget
                          icon='UsbOutlined'
                          size='small'
                        />
                      </div>

                      <div
                        className='text-xs text-gray-500'
                      >
                        {extensionVersion.description}
                      </div>
                    </div>
                  ),
                  onClick: () => {
                    console.log('click');
                  }
                }
              })}
            />

            <div
              className='w-full'
            >
              <ReactCodeMirror
                value={shallowState.selectedExtensionVersion?.script_content}
                theme={vscodeDark}
                className='w-full h-full'
                basicSetup={{
                  lineNumbers: true,
                }}
                readOnly={true}
                extensions={[
                  javascript(),
                  EditorView.lineWrapping
                ]}
              />
            </div>
          </div>
        </Card>
      </Skeleton>

      <ExtensionVersionModal
        ref={extensionVersionModalRef}
        extensionGroup={syncStoreState.selectedExtensionGroup}
        extension={syncStoreState.selectedExtension}
        onSuccess={loadData}
      />
    </div>
  )
}))

const ExtensionWrapper = memo(() => {
  const extensionContainerRef = useRef<HTMLDivElement>(null);

  const [syncStoreState] = useSyncState(() => ({
    selectedExtensionGroup: useExtensionStatusStore(store => store.selectedExtensionGroup),
    selectedExtension: useExtensionStatusStore(store => store.selectedExtension)
  }))

  useEffect(() => {
    metadata.defineMetadataInVector('rxp.ui.layout.vertical.nav.external', ExtensionNavigationWrapper);

    return () => {
      metadata.delMetadataInVector('rxp.ui.layout.vertical.nav.external', ExtensionNavigationWrapper);
    }
  }, []);

  return (

    <SwitchTransition mode='out-in'>
      <CSSTransition
        timeout={300}
        in
        appear
        key={syncStoreState.selectedExtension?.extension_id ?? '-1'}
        nodeRef={extensionContainerRef}
        enter
        exit
        unmountOnExit={false}
        classNames={extensionSwitchCssTransitionClassNames}
      >
        <Extension
          ref={extensionContainerRef}
        />
      </CSSTransition>

    </SwitchTransition>
  )
})

export default ExtensionWrapper;
