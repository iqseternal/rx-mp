import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface ExtensionStatusStore {

  selectedKeys: string[];
}

export const useExtensionStatusStore = create<ExtensionStatusStore>()(
  persist(

    immer(
      (set, get, store) => ({

        selectedKeys: []
      })
    ),
    {
      name: 'extension_status_store',
      storage: createJSONStorage(() => window.sessionStorage)
    }
  )
);
