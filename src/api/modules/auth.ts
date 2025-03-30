
import { rxApiPost, rxRequest } from '../definition'

export interface RXGetAccessTokenApiPayload {

}

export interface RXGetAccessTokenApiResponse {

}

export const rxGetAccessTokenApi = (payload: RXGetAccessTokenApiPayload) => {

  return rxRequest<RXGetAccessTokenApiResponse, {}>({
    url: '/api/v1/auth/get_access_token',
    hConfig: {
      needAuth: false
    },
    headers: {
      'Authorization': 'Bearer ' + 'saasadsa'
    }
  });
}


// =================================================================

export interface RXUpdateAccessTokenApiPayload {

}

export interface RXUpdateAccessTokenApiResponse {

}

export const rxUpdateAccessTokenApi = (payload: RXUpdateAccessTokenApiPayload) => {
  return rxRequest<RXUpdateAccessTokenApiResponse, {}>({
    url: '/api/v1/auth/update_access_token',
    hConfig: {
      needAuth: false
    },
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer'+ 'asdasdasd'
    },
  });
}
