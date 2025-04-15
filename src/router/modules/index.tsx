import { lazy } from 'react';
import { makeRoute } from '../definition';
import { loginRoute, notFoundRoute, notRoleRoute } from './basic';

import RootLayoutWrapper from '@/layout/RootLayout';
import RXPLayoutWrapper from '@/layout/RxpLayout';

export * from './basic';

export const rxpRoute = makeRoute({
  name: 'Rxp',
  path: '/rxp',
  redirect: '/rxp/dashboard',
  meta: {
    hiddenInMenu: true,
    hiddenInOpenHistory: true,
  },
  component: <RXPLayoutWrapper />,
  children: [
    {
      name: 'RxpDashboard',
      path: '/rxp/dashboard',
      meta: {
        title: '控制台',
        icon: 'DashboardOutlined'
      },
      component: lazy(() => import('@/pages/rxp/Dashboard')),
    },
    {
      name: 'RxpExtGAS',
      path: '/rxp/ext',
      meta: {
        title: '扩展',
        icon: 'ProjectOutlined'
      },
      redirect: '/rxp/ext/extension-group',
      children: [
        {
          name: 'RxpExtensionGroup',
          path: '/rxp/ext/extension-group',
          meta: {
            title: '扩展组',
            icon: 'GroupOutlined'
          },
          component: lazy(() => import('@/pages/rxp/Ext/ExtensionGroup'))
        },
        {
          name: 'RxpExtension',
          path: '/rxp/ext/extension',
          meta: {
            title: '扩展',
            icon: 'ExpandOutlined'
          },
          component: lazy(() => import('@/pages/rxp/Ext/Extension'))
        }
      ],
    },
  ]
})

export const rootRoute = makeRoute({
  name: 'Root',
  path: '/',
  redirect: loginRoute.meta.fullPath,
  component: <RootLayoutWrapper />,
  meta: {
    hiddenInMenu: true,
    hiddenInOpenHistory: true,
  },
  children: [
    loginRoute,
    notFoundRoute,
    notRoleRoute,
    rxpRoute
  ]
});
