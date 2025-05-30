
import { injectReadonlyVariable } from '@/libs/common';
import { RXTable } from './Table';

export type RXUIType= {} & {
  readonly Table: typeof RXTable;
};

const RXUI = {} as RXUIType;

injectReadonlyVariable(RXUI, 'Table', RXTable);

export { RXUI };

export default RXUI;
