import { StorageKeys } from '@/constants';
import { ckGet, ckSet, ckRemove, loGet, loSet, loRemove } from '@suey/pkg-web';

/**
 * 获得资源访问凭证
 */
export const getAccessToken = () => ckGet(StorageKeys.AccessToken);

/**
 * 存储资源访问凭证
 */
export const setAccessToken = (token: string) => ckSet(StorageKeys.AccessToken, token);

/**
 * 删除资源访问凭证
 */
export const removeAccessToken = () => ckRemove(StorageKeys.AccessToken);

/**
 * 获得权限访问凭证
 */
export const getRefreshToken = () => loGet<string>(StorageKeys.RefreshToken);

/**
 * 存储权限访问凭证
 */
export const setRefreshToken = (token: string) => loSet<string>(StorageKeys.RefreshToken, token);

/**
 * 删除权限访问凭证
 */
export const removeRefreshToken = () => loRemove(StorageKeys.RefreshToken);

/**
 * 获得 tokens
 */
export const getTokens = () => {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  };
}

/**
 * 存储 tokens
 */
export const setTokens = (payload: { accessToken: string;refreshToken: string }) => {
  const { accessToken, refreshToken } = payload;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
}

/**
 * 删除 tokens
 */
export const removeTokens = () => {
  removeAccessToken();
  removeRefreshToken();
}
