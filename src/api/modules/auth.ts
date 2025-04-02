
import { loGet } from '@suey/pkg-web';
import { rxApiPost, rxRequest } from '../definition'
import { getRefreshToken } from '@/storage/token';

export interface RXGetAccessTokenApiPayload {

}

export interface RXGetAccessTokenApiResponse {

}

export const rxGetAccessTokenApi = (payload: RXGetAccessTokenApiPayload) => {
  const refreshToken = getRefreshToken();

  return rxRequest<RXGetAccessTokenApiResponse, {}>({
    url: '/api/auth/get_access_token',
    hConfig: {
      needAuth: false
    },
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    },
  });
}


// =================================================================

export interface RXUpdateAccessTokenApiPayload {

}

export interface RXUpdateAccessTokenApiResponse {

}

export const rxUpdateAccessTokenApi = (payload: RXUpdateAccessTokenApiPayload) => {
  const refreshToken = getRefreshToken();

  return rxRequest<string, {}>({
    url: '/api/auth/update_access_token',
    hConfig: {
      needAuth: false
    },
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    },
  });
}
