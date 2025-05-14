import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { GetExtensionGroupListApiStruct, GetExtensionListApiStruct } from '@/api/modules';

export interface ExtensionStatusStore {
  selectedExtensionGroup?: GetExtensionGroupListApiStruct;
  selectedExtensionGroupLoading: boolean;

  selectedExtension?: GetExtensionListApiStruct;
  selectedExtensionLoading: boolean;
}

export const useExtensionStatusStore = create<ExtensionStatusStore>()(
  immer(
    (set, get, store) => ({

      selectedExtensionGroupId: void 0,
      selectedExtensionGroupLoading: false,

      selectedExtensionId: void 0,
      selectedExtensionLoading: false
    })
  ),
);
