import mitt from 'mitt';

export type RXPBusEntries = {

  'rxp-navigation-collapsed': never;
  'rxp-navigation-collapsed-change': never;
}

export const rxpBus = mitt<RXPBusEntries>();
