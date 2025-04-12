import { useShallowReactive } from '@/libs/hooks';
import { usePaginationAttrs, useTableAttrs } from '@/libs/hooks/useAttrs';
import { useAsyncEffect, usePagination } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { Alert, App, Button, Card, Space, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { memo, useCallback } from 'react';
import { getExtensionGroupListApi } from '@/api/modules';
import type { GetExtensionGroupListApiResponse, GetExtensionGroupListApiPayload } from '@/api/modules';
import { ClearOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { toNil } from '@suey/pkg-utils';

import Ellipsis from '@/components/Ellipsis';
import Widget from '@/components/Widget';

const ExtensionGroup = memo(() => {
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
              icon='DeleteOutlined'
              className='text-red-500'
              tipText='删除扩展组'
              onClick={() => {
                modal.confirm({
                  title: '是否确认删除?',
                  onOk: () => {

                  },
                  onCancel: () => {


                  }
                })
              }}
            />

            <Button
              type='link'
              onClick={() => {

              }}
            >
              去操作
            </Button>
          </div>
        )
      }
    }
  ]))

  const [shallowTableAttrs] = useTableAttrs<GetExtensionGroupListApiResponse>({
    rowKey: row => row.extension_group_id
  })

  const [shallowPagination] = usePaginationAttrs({});

  const loadData = useCallback(async () => {
    shallowTableAttrs.loading = true;

    const [err, res] = await toNil(getExtensionGroupListApi({}));

    if (err) {
      message.error(`数据加载失败`);
      shallowTableAttrs.loading = false;
      return;
    }

    shallowTableAttrs.dataSource = res.data ?? [];
    shallowPagination.total = res.data?.length ?? 0;
    shallowTableAttrs.loading = false;
  }, []);

  useAsyncEffect(loadData, []);

  return (
    <>
      <Alert
        type='info'
        showIcon
        message={(
          <div>
            创建扩展组, 以使用项目对接对应的扩展集合
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
            >
              新建
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

        <Table
          {...shallowTableAttrs}
          pagination={shallowPagination}
          columns={shallowColumns}
        />
      </Card>
    </>
  )
})

export default ExtensionGroup;
