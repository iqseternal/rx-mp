import type { RouteMeta } from '@/router/definition';
import { memo, useEffect, useLayoutEffect } from 'react';
import { create, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useLocation } from 'react-router-dom';
import { immer } from 'zustand/middleware/immer';

import Widget from '@/components/Widget';

export interface HistoryStore {

  history: RouteMeta[];
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    immer((get, set) => ({

      history: []
    })),
    {
      name: 'rx-open-history-store',
      storage: createJSONStorage(() => window.sessionStorage)
    }
  )
)

export const pushHistory = (routeMeta: RouteMeta) => {
  if (!routeMeta) return;
  if (routeMeta.hiddenInOpenHistory) return;

  const history = useHistoryStore.getState().history;
  if (history.some(item => item.fullPath === routeMeta.fullPath)) return;

  useHistoryStore.setState((state) => {
    state.history.push(routeMeta);
  })
}

export const delHistory = (routeMeta: RouteMeta) => {
  if (!routeMeta) return;

  const history = useHistoryStore.getState().history;
  const nextHistory = history.filter(item => item.fullPath !== routeMeta.fullPath);

  useHistoryStore.setState({ history: nextHistory });
}
