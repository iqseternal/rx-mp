import { lazy } from 'react';
import { makeRoute } from '../definition'

export const notFoundRoute = makeRoute({
  name: 'NotFound',
  path: '*',
  component: lazy(() => import('@/pages/NotFound'))
});

export const notRoleRoute = makeRoute({
  name: 'NotRole',
  path: '/403',
  component: lazy(() => import('@/pages/NotRole'))
});

export const loginRoute = makeRoute({
  name: 'LoginRoute',
  path: '/login',
  component: lazy(() => import('@/pages/Login'))
})
