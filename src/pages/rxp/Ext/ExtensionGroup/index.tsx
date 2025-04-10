import { useShallowReactive } from '@/libs/hooks';
import { usePaginationAttrs, useTableAttrs } from '@/libs/hooks/useAttrs';
import { usePagination } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { memo } from 'react';

interface ExtensionGroupResponse extends Record<string, any> {
  name: string;
}

const ExtensionGroup = memo(() => {

  const [shallowColumns] = useShallowReactive<TableColumnsType<ExtensionGroupResponse>>(() => ([
    {
      key: 'name',
      title: 'name',
      render: (value, row) => {

        return (
          <div>
            {row.name}
          </div>
        )
      }
    }
  ]))

  const [shallowTableAttrs] = useTableAttrs<ExtensionGroupResponse>({})
  const [shallowPagination] = usePaginationAttrs({});

  return (
    <Card>

      <Table
        {...shallowTableAttrs}
        pagination={shallowPagination}
        columns={shallowColumns}
      />
    </Card>
  )
})

export default ExtensionGroup;
