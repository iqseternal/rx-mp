
import { loGet } from '@suey/pkg-web';
import { rxApiPost, rxRequest, type RApiPromiseLike } from '../definition';
import { invoker } from '@/libs/bus';
import { asynced } from '@suey/pkg-utils';

export interface RXGetAccessTokenApiPayload {

}

export interface RXGetAccessTokenApiResponse {

}

export type RxGetAccessTokenApi = (payload: RXGetAccessTokenApiPayload) => RApiPromiseLike<RXGetAccessTokenApiResponse, null>;

export const rxGetAccessTokenApi = asynced<RxGetAccessTokenApi>(async (payload: RXGetAccessTokenApiPayload) => {
  const refreshToken = await invoker.invoke('rx-data-getter-store-access-token');

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

export const rxUpdateAccessTokenApi = asynced<RxUpdateAccessTokenApi>(async (payload: RXUpdateAccessTokenApiPayload) => {
  const refreshToken = await invoker.invoke('rx-data-getter-store-refresh-token');

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
