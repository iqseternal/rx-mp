import type { ComponentType } from 'react';

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
