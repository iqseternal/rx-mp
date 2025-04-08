import { Invoker, Emitter } from '@suey/pkg-web';
import { BusEmitterEntries, BusInvokerEntries } from '@/declare';

export const emitter = new Emitter<BusEmitterEntries>();

export const invoker = new Invoker<BusInvokerEntries>();

export const bus = {
  /**
   *
   */
  emitter: emitter,

  /**
   *
   */
  invoker: invoker
} as const;
