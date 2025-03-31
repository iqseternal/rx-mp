import { lazy } from 'react';
import { makeRoute } from '../definition';
import { loginRoute, notFoundRoute, notRoleRoute } from './basic';

import RootLayoutWrapper from '@/layout/RootLayout';
import RXPLayoutWrapper from '@/layout/RxpLayout';

export * from './basic';

export const rxpRoute = makeRoute({
  name: 'Rxp',
  path: '/rxp',
  redirect: 'dashboard',
  component: <RXPLayoutWrapper />,
  children: [
    {
      name: 'RxpDashboard',
      path: 'dashboard',
      component: lazy(() => import('@/pages/rxp/Dashboard')),
    }
  ]
})

export const rootRoute = makeRoute({
  name: 'Root',
  path: '/',
  redirect: rxpRoute.meta.fullPath,
  component: <RootLayoutWrapper />,
  children: [
    loginRoute,
    notFoundRoute,
    notRoleRoute,
    rxpRoute
  ]
});
