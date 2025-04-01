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
      name: 'RxpForm',
      path: '/rxp/form',
      meta: {
        title: '表单页',
        icon: 'FormOutlined'
      },
      component: lazy(() => import('@/pages/rxp/Dashboard')),
    },
    {
      name: 'RxpList',
      path: '/rxp/list',
      redirect: '/rxp/list/table',
      meta: {
        title: '列表页',
        icon: 'TableOutlined'
      },

      children: [
        {
          name: 'RxpListTable',
          path: '/rxp/list/table',
          meta: {
            title: '查询表格'
          },
          component: lazy(() => import('@/pages/rxp/Dashboard')),
        },
        {
          name: 'RxpListBasicForm',
          path: '/rxp/list/basic-form',
          meta: {
            title: '基础表单'
          },
          redirect: '/rxp/list/basic-form/item1',
          children: [
            {
              name: 'RxpListBasicFormItem1',
              path: '/rxp/list/basic-form/item1',
              meta: {
                title: '基础表单 1'
              },
              component: lazy(() => import('@/pages/rxp/Dashboard')),
            },
            {
              name: 'RxpListBasicFormItem2',
              path: '/rxp/list/basic-form/item2',
              meta: {
                title: '基础表单 2'
              },
              component: lazy(() => import('@/pages/rxp/Dashboard')),
            }
          ]
        }
      ]
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
