import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { TableRef } from 'antd/es/table';
import type { RefTable } from 'antd/es/table/interface';
import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import type { PropsWithChildren, RefAttributes } from 'react';
import { useAutoFixTableSize } from './useAutoFixTableSize';

export type RXTableType = <RecordType = Record<PropertyKey, any>>(props: PropsWithChildren<RXTableProps<RecordType>> & RefAttributes<RXTableInstance>) => React.ReactElement;


export interface RXTableInstance extends TableRef {

}

export interface RXTableProps<RecordType = Record<PropertyKey, any>> extends TableProps<RecordType> {

}

/**
 * RXTable: 表格
 */
export const RXTable = forwardRef<RXTableInstance, RXTableProps>((props, ref) => {

  const tableRef = useRef<TableRef>(null);

  useAutoFixTableSize(tableRef, {});

  useImperativeHandle(ref, () => {
    const instance: RXTableInstance = {
      ...((tableRef.current || {}) as TableRef),
    }

    return instance;
  })

  return (

    <Table
      {...props}
      sticky={props.sticky ? props.sticky : {
        offsetHeader: 0
      }}
      ref={tableRef}
    />
  )
}) as RXTableType;
