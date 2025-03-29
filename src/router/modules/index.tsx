import { lazy } from 'react';
import { makeRoute } from '../definition';
import { loginRoute, notFoundRoute, notRoleRoute } from './basic';

import RootLayout from '@/layout/RootLayout';

export * from './basic';

export const rootRoute = makeRoute({
  name: 'Root',
  path: '/',
  redirect: loginRoute.meta.fullPath,
  component: <RootLayout />,
  children: [
    loginRoute,
    notFoundRoute,
    notRoleRoute,
  ]
});
