import type { AxiosResponse } from '@suey/pkg-utils';
import type { ComponentType } from 'react';
import type { RXApiBasicResponse, RXApiFailResponse, RXApiSuccessResponse } from './api';

export interface MetadataEntries {
  'ui.layout.header.left.before': ComponentType[];
  'ui.layout.header.left.content': ComponentType;
  'ui.layout.header.left.after': ComponentType[];

  'ui.layout.header.center.before': ComponentType[];
  'ui.layout.header.center.content': ComponentType;
  'ui.layout.header.center.after': ComponentType[];

  'ui.layout.header.right.before': ComponentType[];
  'ui.layout.header.right.content': ComponentType;
  'ui.layout.header.right.after': ComponentType[];

  /**
   * rxp 垂直菜单, 位于外部, Header 左侧
   */
  'rxp.ui.layout.vertical.nav.external': ComponentType[];

  /**
   * rxp 垂直菜单, 位于内部, Header 组件下方
   */
  'rxp.ui.layout.vertical.nav.internal': ComponentType[];
}

export type BusEmitterEntries = {
  /**
   * 通用错误分发器
   */
  'err-distributor': any;
}

export type BusInvokerEntries = {
  /**
   * api-err 分发器
   */
  'rx-api-err-distributor': (response: AxiosResponse<RXApiSuccessResponse, RXApiFailResponse>) => Promise<RXApiBasicResponse>;

  'rx-api-err:unauthorized-resource': (response: AxiosResponse<RXApiSuccessResponse, RXApiFailResponse>) => Promise<RXApiBasicResponse>;
  'rx-api-err:unauthorized-credential': (response: AxiosResponse<RXApiSuccessResponse, RXApiFailResponse>) => Promise<RXApiBasicResponse>;

  /**
   * invoker: 获取 store access_token
   */
  'rx-data-getter-store-access-token': () => Promise<string | null>;

  /**
   * invoker: 获取 store refresh_token
   */
  'rx-data-getter-store-refresh-token': () => Promise<string | null>;
}
