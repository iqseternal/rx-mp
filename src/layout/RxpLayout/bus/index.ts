import mitt from 'mitt';

export type RXPBusEntries = {

  'rxp-navigation-collapsed': boolean;
  'rxp-navigation-collapsed-change': void;
}

export const rxpBus = mitt<RXPBusEntries>();
