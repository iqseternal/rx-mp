import { metadata } from '@/libs/rxp-meta';
import { Alert, App, Button, Card, Space, Switch, Table, Tabs, Timeline, type TableColumnsType } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ExtensionGroupModalInstance } from '../ExtensionGroup/ExtensionGroupModal';
import type { TableRef } from 'antd/es/table';
import { ModalMode } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { useAsyncEffect, useShallowReactive, useTransition } from '@/libs/hooks';
import { usePaginationAttrs, useTableAttrs } from '@/libs/hooks/useAttrs';
import { getExtensionListApi } from '@/api/modules';
import type { GetExtensionListApiResponse } from '@/api/modules';
import { toNil } from '@suey/pkg-utils';
import Icon, { ClearOutlined, ClockCircleOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { toBizErrorMsg } from '@/error/code';
import { ExtensionModal, type ExtensionModalInstance } from './ExtensionModal';
import { useExtensionStatusStore } from './store/useExtensionStatusStore';
import { useSyncNormalState } from '@/libs/hooks/useReactive';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@uiw/react-codemirror';

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

  const [syncStoreState] = useSyncNormalState(() => ({
    extensionGroupId: useExtensionStatusStore(store => store.selectedExtensionGroupId),
    extensionId: useExtensionStatusStore(store => store.selectedExtensionId)
  }))


  useAsyncEffect(async () => {

  }, []);


  return (
    <div
      ref={ref}
    >
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
                children: 'Create a services site 2015-09-01',
              },
              {
                children: 'Solve initial network problems 2015-09-01',
              },
              {
                dot: <ClockCircleOutlined className="timeline-clock-icon" />,
                color: 'red',
                children: 'Technical testing 2015-09-01',
              },
              {
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

  useEffect(() => {
    metadata.defineMetadataInVector('rxp.ui.layout.vertical.nav.external', ExtensionNavigationWrapper);

    return () => {
      metadata.delMetadataInVector('rxp.ui.layout.vertical.nav.external', ExtensionNavigationWrapper);
    }
  }, []);

  return (
    <Extension />
  )
})

export default ExtensionWrapper;
