import { metadata } from '@/libs/rxp-meta';
import { Alert, App, Button, Card, Space, Switch, Table, Tabs, Timeline, type TableColumnsType } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ExtensionGroupModalInstance } from '../ExtensionGroup/mods/ExtensionGroupModal';
import type { TableRef } from 'antd/es/table';
import { ModalMode } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { useAsyncEffect, useShallowReactive, useTransition } from '@/libs/hooks';
import { usePaginationAttrs, useTableAttrs } from '@/libs/hooks/useAttrs';
import { getExtensionListApi, getExtensionVersionListApi } from '@/api/modules';
import type { GetExtensionListApiResponse, GetExtensionVersionListApiStruct } from '@/api/modules';
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

import Ellipsis from '@/components/Ellipsis';
import Widget from '@/components/Widget';
import moment from 'moment';
import ExtensionNavigationWrapper from './plats/ExtensionNavigation';
import IconFont from '@/components/IconFont';
import RXUI from '@/b-components/RXUI';
import TabPane from 'antd/es/tabs/TabPane';
import ReactCodeMirror from '@uiw/react-codemirror';

const Extension = memo(forwardRef<HTMLDivElement>((props, ref) => {
  const navigate = useNavigate();

  const { message, modal } = App.useApp();

  const [syncStoreState] = useSyncState(() => ({
    selectedExtensionGroup: useExtensionStatusStore(store => store.selectedExtensionGroup),
    selectedExtension: useExtensionStatusStore(store => store.selectedExtension)
  }))

  const [shallowState] = useShallowReactive(() => ({
    extensionVersionList: [] as GetExtensionVersionListApiStruct[],
    extensionVersionListLoading: false,
  }))

  useAsyncEffect(async () => {
    if (!syncStoreState.selectedExtension) return;

    const extensionId = syncStoreState.selectedExtension.extension_id;
    const extensionUuid = syncStoreState.selectedExtension.extension_uuid;

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
  }, [syncStoreState.selectedExtension]);


  return (
    <div
      ref={ref}
    >
      <Alert
        type='info'
        showIcon
        className='mb-2'
        message={(
          <div>
            <Space>
              <span>
                {syncStoreState.selectedExtension?.extension_id}
              </span>

              <span>
                {syncStoreState.selectedExtension?.extension_name}
              </span>

              <Switch
                value={syncStoreState.selectedExtension?.enabled === 1}
                checkedChildren='已启用'
                unCheckedChildren='未启用'
              />
            </Space>
          </div>
        )}
      />

      <Card>
        <div
          className='w-full flex justify-between items-center'
        >
          <div>

          </div>

          <Space>
            <Button
              type='primary'
              icon={(
                <IconFont icon='FolderAddOutlined' />
              )}
              onClick={() => {

              }}
            >
              Create
            </Button>
          </Space>
        </div>

        <div
          className='w-full flex justify-between items-center'
        >
          <Timeline
            items={[
              {
                dot: (
                  <IconFont
                    icon='CrownOutlined'
                  />
                ),
                color: 'green',
                children: 'Create a services site 2015-09-01',
              },
              {
                dot: (
                  <IconFont
                    icon='ForkOutlined'
                  />
                ),
                color: 'blue',
                children: 'Solve initial network problems 2015-09-01',
              },
              {
                dot: (
                  <IconFont
                    icon='ForkOutlined'
                  />
                ),
                color: 'gray',
                children: 'Technical testing 2015-09-01',
              },
              {
                dot: (
                  <IconFont
                    icon='ForkOutlined'
                  />
                ),
                color: 'blue',
                children: 'Network problems being solved 2015-09-01',
              },
            ]}
          />

          <div
            className='w-full'
          >
            <ReactCodeMirror
              value={JSON.stringify({ name: 'asdsad', age: 20 }, null, 2)}
              theme={vscodeDark}
              className='w-full h-full'
              basicSetup={{
                lineNumbers: true,
              }}
              extensions={[
                javascript(),
                EditorView.lineWrapping
              ]}
            />
          </div>
        </div>
      </Card>
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
        key={syncStoreState.selectedExtension?.extension_id}
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
