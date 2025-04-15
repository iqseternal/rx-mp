import { useShallowReactive } from '@/libs/hooks';
import { toNil, asynced, RPromiseLike } from '@suey/pkg-utils';
import { useEffect, useLayoutEffect } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface UserStore {
  userinfo?: {
    roles?: string[];
    id?: number;
    username?: string;
  };
}

export const useUserStore = create<UserStore>()(
  persist(
    immer(
      (set, get, store) => ({
        // store
        userinfo: void 0
      })
    ),
    {
      name: 'userStore',
      storage: createJSONStorage<UserStore>(() => (window.sessionStorage)),
      partialize(state) {

        return {
          userinfo: state.userinfo
        }
      },
    }
  )
);
