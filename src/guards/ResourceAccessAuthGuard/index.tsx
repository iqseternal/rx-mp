import { NotHasAnyData } from '@/components/Empty/NotHasAnyData';
import { useAsyncEffect, useNormalState, useShallowReactive } from '@/libs/hooks';
import { retrieveRoutes } from '@/router';
import type { ReactNode } from 'react';
import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokensStore } from '@/stores';
import { toNil } from '@suey/pkg-utils';
import { rxUpdateAccessTokenApi } from '@/api/modules';

import NProgress from 'nprogress';
import Empty from '@/components/Empty';

export interface ResourceAccessAuthGuardProps {
  children: ReactNode;
}

/**
 * 资源访问控制鉴权守卫, 查看自身时候具有 access_token 数据
 */
export const ResourceAccessAuthGuard = memo<ResourceAccessAuthGuardProps>((props) => {
  const { children } = props;

  const navigate = useNavigate();

  const [accessToken] = useTokensStore(store => store.accessToken);

  useAsyncEffect(async () => {
    if (accessToken.value && accessToken.value !== '') return;

    useTokensStore.removeAccessToken();
    useTokensStore.removeRefreshToken();

    const { notRoleRoute } = retrieveRoutes();

    navigate(notRoleRoute.meta.fullPath, { replace: true });
  }, [accessToken.value]);

  if (!accessToken.value) return <Empty.Wrong />;
  return children;
})

export default ResourceAccessAuthGuard;
