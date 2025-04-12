import { NotHasAnyData } from '@/components/Empty/NotHasAnyData';
import { useNormalState } from '@/libs/hooks';
import { retrieveRoutes } from '@/router';
import { getAccessToken } from '@/storage/token';
import type { ReactNode } from 'react';
import { memo, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Empty from '@/components/Empty';

export interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = memo<AuthGuardProps>((props) => {
  const { children } = props;

  const navigate = useNavigate();

  const [normalState] = useNormalState(() => ({
    hasAuthed: false,
  }))

  normalState.hasAuthed = !!getAccessToken();

  useEffect(() => {
    if (normalState.hasAuthed) return;

    const { notRoleRoute } = retrieveRoutes();
    navigate(notRoleRoute.meta.fullPath, { replace: true });
  }, [normalState.hasAuthed]);


  if (!normalState.hasAuthed) return <Empty.Wrong />;
  return children;
})

export default AuthGuard;
