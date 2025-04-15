import { NotHasAnyData } from '@/components/Empty/NotHasAnyData';
import { useNormalState } from '@/libs/hooks';
import { retrieveRoutes } from '@/router';
import { getAccessToken } from '@/storage/token';
import type { ReactNode } from 'react';
import { memo, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokensStore } from '@/stores';

import Empty from '@/components/Empty';

export interface ResourceAccessAuthGuardProps {
  children: ReactNode;
}

export const ResourceAccessAuthGuard = memo<ResourceAccessAuthGuardProps>((props) => {
  const { children } = props;

  const navigate = useNavigate();

  const [accessToken] = useTokensStore(store => store.accessToken);

  useEffect(() => {
    const hasAuthed = !!accessToken.value;
    if (hasAuthed) return;

    const { notRoleRoute } = retrieveRoutes();
    navigate(notRoleRoute.meta.fullPath, { replace: true });
  }, [accessToken.value]);

  if (!accessToken.value) return <Empty.Wrong />;
  return children;
})

export default ResourceAccessAuthGuard;
