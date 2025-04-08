
import type { MetadataEntries } from '@/declare';
import { ExtensionManager, MetadataManager, type Extension } from '@suey/rxp-meta';
import type { ComponentType } from 'react';

export const metadata = new MetadataManager<MetadataEntries>();
