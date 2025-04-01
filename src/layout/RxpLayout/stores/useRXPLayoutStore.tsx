import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface RXPLayoutStore {

  status: {

    rxpNavigationCollapsed: boolean;
  }

  skin: {};
}

export const useRXPLayoutStore = create<RXPLayoutStore>()(
  persist(
    immer(
      (set, get, store) => ({

        status: {
          rxpNavigationCollapsed: false,
        },

        skin: {}
      })
    )
    ,
    {
      name: 'userStore',
      storage: createJSONStorage(() => window.sessionStorage)
    }
  )
);
