import { useNormalState, useShallowReactive } from '@/libs/hooks';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, removeAccessToken, removeRefreshToken, setTokens, getTokens, removeTokens } from '@/storage/token';
import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface TokensStore {
  accessToken?: string;
  refreshToken?: string;
}

export interface UseTokensStore<Store extends TokensStore> {
  <T>(selector: (store: Store) => T): [{ readonly value: T }];

  getState(): TokensStore;

  getAccessToken: typeof getAccessToken;
  getRefreshToken: typeof getRefreshToken;
  getTokens: typeof getTokens;

  setAccessToken: typeof setAccessToken;
  setRefreshToken: typeof setRefreshToken;
  setTokens: typeof setTokens;

  removeAccessToken: typeof removeAccessToken;
  removeRefreshToken: typeof removeRefreshToken;
  removeTokens: typeof removeTokens;
}

const useInnerStore = create<TokensStore>()(
  immer(
    (set, get, store) => ({
      accessToken: getAccessToken(),
      refreshToken: getRefreshToken()
    })
  ),
);

export const useTokensStore: UseTokensStore<TokensStore> = (selector) => {
  const value = useInnerStore(selector);

  const [normalState] = useNormalState({
    value: value
  })

  if (normalState.value !== value) normalState.value = value;
  return [normalState] as const;
}

useTokensStore.getState = () => useInnerStore.getState();

useTokensStore.getAccessToken = () => useInnerStore.getState().accessToken ?? '';

useTokensStore.getRefreshToken = () => useInnerStore.getState().refreshToken ?? '';

useTokensStore.getTokens = () => {
  const state = useInnerStore.getState();

  return {
    accessToken: state.accessToken ?? '',
    refreshToken: state.refreshToken ?? ''
  }
}

useTokensStore.setAccessToken = (accessToken: string) => {
  useInnerStore.setState({ accessToken: accessToken });

  if (!accessToken || accessToken === '') removeAccessToken();
  else setAccessToken(accessToken);
}

useTokensStore.setRefreshToken = (refreshToken: string) => {
  useInnerStore.setState({ refreshToken: refreshToken });

  if (!refreshToken || refreshToken === '') removeRefreshToken();
  else setRefreshToken(refreshToken);
}

useTokensStore.setTokens = (tokens: TokensStore) => {
  useInnerStore.setState({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  })

  if (!tokens.accessToken || tokens.accessToken === '') removeAccessToken();
  else setAccessToken(tokens.accessToken);

  if (!tokens.refreshToken || tokens.refreshToken === '') removeRefreshToken();
  else setRefreshToken(tokens.refreshToken);
}

useTokensStore.removeAccessToken = () => {
  useInnerStore.setState({ accessToken: void 0 });
  return removeAccessToken();
}

useTokensStore.removeRefreshToken = () => {
  useInnerStore.setState({ refreshToken: void 0 });
  return removeRefreshToken();
}

useTokensStore.removeTokens = () => {
  useInnerStore.setState({
    accessToken: void 0,
    refreshToken: void 0
  })
  return removeTokens();
}

