
import { injectReadonlyVariable } from '@/libs/common';
import { RXTableSearchContainer } from './RXTableSearchContainer';

export type ContainerType = {} & {
  RXTableSearch: typeof RXTableSearchContainer;
}

const RXContainer: ContainerType = {} as ContainerType;

injectReadonlyVariable(RXContainer, 'RXTableSearch', RXTableSearchContainer);

export { RXContainer }

export default RXContainer;
