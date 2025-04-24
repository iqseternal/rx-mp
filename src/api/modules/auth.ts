
import { loGet } from '@suey/pkg-web';
import { rxApiPost, rxRequest, type RApiPromiseLike } from '../definition';
import { invoker } from '@/libs/bus';
import { asynced } from '@suey/pkg-utils';

export interface RXGetAccessTokenApiPayload {

}

export interface RXGetAccessTokenApiResponse {

}

export type RxGetAccessTokenApi = (payload: RXGetAccessTokenApiPayload) => RApiPromiseLike<RXGetAccessTokenApiResponse, null>;

/**
 * 获取当前用户对应得 access_token.
 */
export const rxGetAccessTokenApi = asynced<RxGetAccessTokenApi>(async (payload: RXGetAccessTokenApiPayload) => {
  const refreshToken = await invoker.invoke('rx-data-getter-store:access-token');

  return rxRequest<RXGetAccessTokenApiResponse, {}>({
    url: '/api/auth/get_access_token',
    hConfig: {
      needAuth: false
    },
    headers: {
      'Authorization': refreshToken ? `Bearer ${refreshToken}` : void 0
    },
  });
})


// =================================================================

export interface RXUpdateAccessTokenApiPayload {

}

export interface RXUpdateAccessTokenApiResponse {

}

export type RxUpdateAccessTokenApi = (payload: RXUpdateAccessTokenApiPayload) => RApiPromiseLike<string, null>;

/**
 * 更新当前用户的 access_token, 相应的, 对应的旧 token 会失效
 */
export const rxUpdateAccessTokenApi = asynced<RxUpdateAccessTokenApi>(async (payload: RXUpdateAccessTokenApiPayload) => {
  const refreshToken = await invoker.invoke('rx-data-getter-store:refresh-token');

  return rxRequest<string, {}>({
    url: '/api/auth/update_access_token',
    hConfig: {
      needAuth: false
    },
    method: 'POST',
    headers: {
      'Authorization': refreshToken ? `Bearer ${refreshToken}` : void 0
    },
  });
})
