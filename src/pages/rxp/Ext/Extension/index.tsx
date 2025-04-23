import { metadata } from '@/libs/rxp-meta';
import { Alert, App, Button, Card, Space, Switch, Table, type TableColumnsType } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ExtensionGroupModalInstance } from '../ExtensionGroup/ExtensionGroupModal';
import type { TableRef } from 'antd/es/table';
import { ModalMode } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { useAsyncEffect, useShallowReactive, useTransition } from '@/libs/hooks';
import { usePaginationAttrs, useTableAttrs } from '@/libs/hooks/useAttrs';
import { getExtensionGroupListApi, getExtensionListApi, type GetExtensionGroupListApiResponse, type GetExtensionListApiPayload, type GetExtensionListApiResponse } from '@/api/modules';
import { toNil } from '@suey/pkg-utils';
import { ClearOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useTokensStore } from '@/stores';
import { toBizErrorMsg } from '@/error/code';
import { ExtensionModal, type ExtensionModalInstance } from './ExtensionModal';
import { useExtensionStatusStore } from './store/useExtensionStatusStore';
import { useSyncNormalState } from '@/libs/hooks/useReactive';
import { bus } from '@/libs/bus';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { extensionCardCssTransitionClassNames } from './definition';

import Ellipsis from '@/components/Ellipsis';
import Widget from '@/components/Widget';
import moment from 'moment';
import ExtensionGroupNavigationWrapper from './plats/ExtensionGroupNavigation';
import IconFont from '@/components/IconFont';
import RXUI from '@/b-components/RXUI';

const ExtensionDeleteWidget = memo(({ row, onSuccess }: { row: GetExtensionListApiResponse; onSuccess: () => void; }) => {
  const { message, modal } = App.useApp();

  const [extensionDeleting, deleteExtension] = useTransition(async () => {
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

const Extension = memo(forwardRef<HTMLDivElement>((props, ref) => {
  const navigate = useNavigate();

  const extensionModalRef = useRef<ExtensionModalInstance>(null);
  const tableRef = useRef<TableRef>(null);

  const { message, modal } = App.useApp();

  const [extensionGroupId] = useExtensionStatusStore(store => store.selectedKeys);

  const [syncState] = useSyncNormalState(() => {
    const id = Number(extensionGroupId);
    const validId = Number.isNaN(id) ? void 0 : id;

    return {
      extensionGroupId: validId
    }
  })

  const [shallowColumns] = useShallowReactive<TableColumnsType<GetExtensionListApiResponse>>(() => ([
    {
      key: 'extension_id',
      title: 'id',
      fixed: 'left',
      width: 80,
      render: (value, row) => {

        return (
          <div>
            {row.extension_id}
          </div>
        )
      }
    },
    {
      key: 'extension_name',
      title: '扩展名称',
      width: 250,
      render: (value, row) => {

        return (
          <Ellipsis.Popover>
            {row.extension_name}
          </Ellipsis.Popover>
        )
      }
    },
    {
      key: 'created_time',
      title: '创建时间',
      width: 200,
      render: (value, row) => {
        const date = moment(row.created_time);
        if (date.isValid()) return date.format('YYYY/MM/DD hh:mm:ss');
        return '-';
      }
    },
    {
      key: 'operator',
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (value, row) => {

        return (
          <div
            className='flex items-center'
          >
            <Widget
              icon='EditOutlined'
              tipText='编辑'
              className='text-blue-500'
              onClick={() => {
                extensionModalRef.current?.open(ModalMode.Edit, row);
              }}
            />

            <ExtensionDeleteWidget
              row={row}
              onSuccess={() => loadData()}
            />
          </div>
        )
      }
    }
  ] as const));

  const [shallowTableAttrs] = useTableAttrs<GetExtensionListApiResponse>({
    rowKey: row => row.extension_id
  })

  const [shallowPagination] = usePaginationAttrs({
    onChange: () => loadData()
  });

  const loadData = useCallback(async () => {
    if (!syncState.extensionGroupId) {
      shallowTableAttrs.dataSource = [];
      shallowPagination.total = 0;
      return;
    }

    const extensionGroupId = Number(syncState.extensionGroupId);
    if (Number.isNaN(extensionGroupId)) {
      shallowTableAttrs.dataSource = [];
      shallowPagination.total = 0;
      return;
    }

    if (shallowTableAttrs.loading) return;
    shallowTableAttrs.loading = true;

    const [err, res] = await toNil(getExtensionListApi({
      extension_group_id: extensionGroupId,
    }));

    if (err) {
      message.error(toBizErrorMsg(err.reason, `数据加载失败`));
      shallowTableAttrs.loading = false;
      return;
    }

    shallowTableAttrs.dataSource = res.data ?? [];
    shallowPagination.total = res.data?.length ?? 0;
    shallowTableAttrs.loading = false;
  }, []);

  useAsyncEffect(loadData, [syncState.extensionGroupId]);

  return (
    <div
      ref={ref}
    >
      <Alert
        type='info'
        showIcon
        message={(
          <div>
            创建扩展
          </div>
        )}
      />

      <Card>
        <div
          className='w-full flex justify-between mb-2'
        >
          <Space>

            <Button
              type='primary'
              icon={<FolderAddOutlined />}
              onClick={() => {
                extensionModalRef.current?.open();
              }}
            >
              新建
            </Button>

            <Button
              type='primary'
              onClick={() => {
                useTokensStore.removeAccessToken();
              }}
            >
              清除资源访问权限
            </Button>
          </Space>

          <Space>
            <Button
              type='default'
              icon={<ClearOutlined />}
            >
              重置
            </Button>
            <Button
              type='primary'
              icon={<SearchOutlined />}
            >
              搜索
            </Button>
          </Space>
        </div>

        <RXUI.Table
          {...shallowTableAttrs}
          pagination={shallowPagination}
          columns={shallowColumns}
          ref={tableRef}
        />

        <ExtensionModal
          ref={extensionModalRef}
          extensionGroupId={syncState.extensionGroupId}
          onSuccess={loadData}
        />
      </Card>
    </div>
  )
}))

const ExtensionWrapper = memo(() => {
  const extensionContainerRef = useRef<HTMLDivElement>(null);

  const selectedKeys = useExtensionStatusStore(store => store.selectedKeys);

  useEffect(() => {
    metadata.defineMetadataInVector('rxp.ui.layout.vertical.nav.external', ExtensionGroupNavigationWrapper);


    return () => {

      metadata.delMetadataInVector('rxp.ui.layout.vertical.nav.external', ExtensionGroupNavigationWrapper);
    }
  }, []);

  return (

    <SwitchTransition mode='out-in'>
      <CSSTransition
        key={selectedKeys?.[0] ?? 'extension-card'}
        timeout={200}
        appear
        in
        classNames={extensionCardCssTransitionClassNames}
        enter
        exit
        unmountOnExit={true}
        nodeRef={extensionContainerRef}
      >
        <Extension
          ref={extensionContainerRef}
        />
      </CSSTransition>
    </SwitchTransition>
  )
})

export default ExtensionWrapper;
