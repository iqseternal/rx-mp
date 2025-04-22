import type { TableProps } from 'antd'

import { useShallowReactive } from './useReactive';
import { seGet, seSet } from '@suey/pkg-web';
import { StorageKeys } from '@/constants';

export type PaginationProps = Exclude<Required<TableProps<{}>>['pagination'], boolean>;

/**
 * 创建分页内容
 */
export function usePaginationAttrs<Attrs extends PaginationProps>(attrs?: Attrs) {
  const [shallowPaginationAttrs] = useShallowReactive<PaginationProps>(() => {
    const pageSize = seGet<number>(StorageKeys.MemoryPageSize) ?? 15;

    return {
      current: 1,
      pageSize: pageSize,
      pageSizeOptions: [15, 30, 50, 100],
      locale: {
        page: '页',
        items_per_page: '/ 页',
      },
      defaultCurrent: 1,
      defaultPageSize: 10,
      showQuickJumper: true,
      showPrevNextJumpers: true,
      showLessItems: true,
      showSizeChanger: true,
      size: 'default' as const,
      showTotal: (total, range) => <>共&nbsp;{total}&nbsp;条</>,
      onShowSizeChange(current, size) {
        shallowPaginationAttrs.current = current
        shallowPaginationAttrs.pageSize = size
        seSet(StorageKeys.MemoryPageSize, size)
      },
      ...(attrs ?? {}),
      onChange(page, pageSize) {
        shallowPaginationAttrs.current = page
        shallowPaginationAttrs.pageSize = pageSize
        seSet(StorageKeys.MemoryPageSize, pageSize)
        if (attrs?.onChange) attrs.onChange(page, pageSize)
      },
    }
  })

  return [shallowPaginationAttrs] as const;
}

/**
 * 创建表格的基本 attrs
 */
export function useTableAttrs<Record>(attrs?: TableProps<Record>) {
  const [shallowTableAttrs] = useShallowReactive<TableProps<Record>>(() => {
    // const autoFixSize = getStorageAutoFixSize();

    return {
      scroll: {},
      tableLayout: 'fixed',
      dataSource: [] as Record[],
      ...(attrs ?? {}),
    }
  })

  return [shallowTableAttrs] as const
}
