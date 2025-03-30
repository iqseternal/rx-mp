
import { ExtensionManager, MetadataManager, type Extension } from '@suey/rxp-meta';
import type { ComponentType } from 'react';

export interface MetadataEntries {
  'test': ComponentType;
}

export const metadata = new MetadataManager<MetadataEntries>();

