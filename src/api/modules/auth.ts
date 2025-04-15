
import { loGet } from '@suey/pkg-web';
import { rxApiPost, rxRequest } from '../definition'
import { getRefreshToken } from '@/storage/token';
import { invoker } from '@/libs/bus';

export interface RXGetAccessTokenApiPayload {

}

export interface RXGetAccessTokenApiResponse {

}

export const rxGetAccessTokenApi = async (payload: RXGetAccessTokenApiPayload) => {
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
}


// =================================================================

export interface RXUpdateAccessTokenApiPayload {

}

export interface RXUpdateAccessTokenApiResponse {

}

export const rxUpdateAccessTokenApi = async (payload: RXUpdateAccessTokenApiPayload) => {
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
}
