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

  'rxp.ui.layout.vertical.nav.external': ComponentType[];
  'rxp.ui.layout.vertical.nav.internal': ComponentType[];
}
