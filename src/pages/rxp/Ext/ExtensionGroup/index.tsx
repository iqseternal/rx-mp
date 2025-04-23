import { useShallowReactive, useTransition } from '@/libs/hooks';
import { usePaginationAttrs, useTableAttrs } from '@/libs/hooks/useAttrs';
import { useAsyncEffect, usePagination } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { Alert, App, Button, Card, Form, Input, InputNumber, Popover, Space, Switch, Table } from 'antd';
import type { ColumnsType, TableRef } from 'antd/es/table';
import { memo, useCallback, useRef } from 'react';
import { getExtensionGroupListApi } from '@/api/modules';
import { GetExtensionGroupListApiResponse, GetExtensionGroupListApiPayload, deleteExtensionGroupApi } from '@/api/modules';
import { ClearOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { toNil } from '@suey/pkg-utils';
import { useTokensStore, useUserStore } from '@/stores';
import { toBizErrorMsg } from '@/error/code';
import { ModalMode } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { ExtensionGroupModal, ExtensionGroupModalInstance } from './ExtensionGroupModal';
import { retrieveRoutes } from '@/router';
import type { TableRowSelection } from 'antd/es/table/interface';

import Ellipsis from '@/components/Ellipsis';
import Widget from '@/components/Widget';
import IconFont from '@/components/IconFont';
import moment from 'moment';
import RXContainer from '@/b-components/RXContainer';
import RXUI from '@/b-components/RXUI';

const ExtensionGroupDeleteWidget = memo(({ row, onSuccess }: { row: GetExtensionGroupListApiResponse; onSuccess: () => void; }) => {
  const { message, modal } = App.useApp();

  const [extensionGroupDeleting, deleteExtensionGroup] = useTransition(async () => {
    const [err, res] = await toNil(deleteExtensionGroupApi({
      certificates: [
        {
          extension_group_id: row.extension_group_id,
          extension_group_uuid: row.extension_group_uuid
        }
      ]
    }));

    if (err) {
      message.error(toBizErrorMsg(err.reason, `删除扩展组 ${row.extension_group_name} 失败`));
      return;
    }

    message.success(`删除扩展组 ${row.extension_group_name} 成功`);
    onSuccess && onSuccess();
  }, []);

  return (
    <Widget
      icon='DeleteOutlined'
      className='text-red-500'
      tipText='删除扩展组'
      loading={extensionGroupDeleting.pending}
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
          onOk: deleteExtensionGroup,
          onCancel: () => {

          }
        })
      }}
    />
  )
})

interface ExtensionGroupSearchForm {
  extension_group_id?: number;
  extension_group_name?: string;
}

const ExtensionGroup = memo(() => {
  const navigate = useNavigate();

  const extensionGroupModalRef = useRef<ExtensionGroupModalInstance>(null);

  const { message, modal } = App.useApp();

  const [shallowColumns] = useShallowReactive<TableColumnsType<GetExtensionGroupListApiResponse>>(() => ([
    {
      key: 'extension_group_id',
      title: 'id',
      fixed: 'left',
      width: 80,
      render: (value, row) => {

        return (
          <div>
            {row.extension_group_id}
          </div>
        )
      }
    },
    {
      key: 'extension_group_name',
      title: '扩展组名称',
      width: 250,
      render: (value, row) => {

        return (
          <Ellipsis.Popover>
            {row.extension_group_name}
          </Ellipsis.Popover>
        )
      }
    },
    {
      key: 'enabled',
      title: '扩展组启用状态',
      width: 120,
      render: (value, row) => {

        return (
          <Switch
            checked={row.enabled === 1}
          />
        )
      }
    },

    {
      key: 'description',
      title: '扩展组描述',
      width: 350,
      render: (value, row) => {

        return (
          <Ellipsis.Popover>
            {row.description}
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
                extensionGroupModalRef.current?.open(ModalMode.Edit, row);
              }}
            />

            <ExtensionGroupDeleteWidget
              row={row}
              onSuccess={() => loadData()}
            />

            <Widget
              icon='ArrowRightOutlined'
              tipText='前往插件组'
              className='text-blue-500'
              onClick={() => {
                navigate(`/rxp/ext/extension?extension_group_id=${row.extension_group_id}`)
              }}
            />
          </div>
        )
      }
    }
  ] as const));

  const [searchForm] = Form.useForm<ExtensionGroupSearchForm>();

  const [shallowTableAttrs] = useTableAttrs<GetExtensionGroupListApiResponse>({
    rowKey: row => row.extension_group_id
  })

  const [shallowPagination] = usePaginationAttrs({
    onChange: (page, pageSize) => loadData()
  });

  const [shallowRowSelection] = useShallowReactive<TableRowSelection<GetExtensionGroupListApiResponse>>(() => ({
    selectedRowKeys: [],
    onChange(selectedRowKeys, selectedRows, info) {
      shallowRowSelection.selectedRowKeys = selectedRowKeys;
    },
  }))

  const loadData = useCallback(async () => {
    if (shallowTableAttrs.loading) return;
    shallowTableAttrs.loading = true;

    const searchData = searchForm.getFieldsValue();

    const [err, res] = await toNil(getExtensionGroupListApi({
      page: shallowPagination.current,
      page_size: shallowPagination.pageSize,

      extension_group_id: searchData.extension_group_id,
      extension_group_name: searchData.extension_group_name
    }));

    if (err) {
      message.error(toBizErrorMsg(err.reason, `数据加载失败`));
      shallowTableAttrs.loading = false;
      return;
    }

    shallowTableAttrs.dataSource = res.data.list ?? [];
    shallowPagination.total = res.data.total ?? 0;
    shallowTableAttrs.loading = false;
  }, []);

  useAsyncEffect(loadData, []);

  return (
    <div className='w-full h-full'>
      <Alert
        type='info'
        showIcon
        message={(
          <div>
            <div>创建扩展组, 以使得项目能够对接对应的扩展集合。</div>
          </div>
        )}
      />

      <Card>
        <RXContainer.RXTableSearch className='mb-2'>
          <Form
            layout='inline'
            form={searchForm}
          >
            <Form.Item
              label='id'
              name='extension_group_id'
            >
              <InputNumber
                placeholder='请输入id'
                className='w-full'
                min={0}
              />
            </Form.Item>

            <Form.Item
              label='扩展组名称'
              name='extension_group_name'
            >
              <Input
                placeholder='请输入扩展组名称'
                maxLength={64}
                allowClear
              />
            </Form.Item>
          </Form>
        </RXContainer.RXTableSearch>

        <div className='flex justify-between items-center mb-2'>
          <Space>
            <Button
              type='primary'
              icon={<FolderAddOutlined />}
              onClick={() => {
                extensionGroupModalRef.current?.open();
              }}
            >
              新建
            </Button>
          </Space>

          <Space>
            <Button
              type='default'
              icon={<ClearOutlined />}
              onClick={() => {
                searchForm.resetFields();
                loadData();
              }}
            >
              重置
            </Button>
            <Button
              type='primary'
              icon={<SearchOutlined />}
              onClick={loadData}
            >
              搜索
            </Button>
          </Space>
        </div>

        <RXUI.Table
          {...shallowTableAttrs}
          pagination={shallowPagination}
          columns={shallowColumns}
          rowSelection={shallowRowSelection}
        />

        <ExtensionGroupModal
          ref={extensionGroupModalRef}
          onSuccess={loadData}
        />
      </Card>
    </div>
  )
})

export default ExtensionGroup;
