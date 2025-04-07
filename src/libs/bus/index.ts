
import { BusEntries } from '@/declare';

import mitt from 'mitt';

export const bus = mitt<BusEntries>();
