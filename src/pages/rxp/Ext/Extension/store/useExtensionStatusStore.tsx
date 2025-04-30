import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { GetExtensionGroupListApiResponse, GetExtensionListApiResponse } from '@/api/modules';

export interface ExtensionStatusStore {
  selectedExtensionGroup?: GetExtensionGroupListApiResponse;

  selectedExtension?: GetExtensionListApiResponse;
}

export const useExtensionStatusStore = create<ExtensionStatusStore>()(
  persist(

    immer(
      (set, get, store) => ({

        selectedExtensionGroupId: void 0,

        selectedExtensionId: void 0
      })
    ),
    {
      name: 'extension_status_store',
      storage: createJSONStorage(() => window.sessionStorage)
    }
  )
);
