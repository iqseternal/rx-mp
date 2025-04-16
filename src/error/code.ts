import type { RXApiBasicResponse } from '@/api';

export enum Biz {
  Success = 0,
  Failure = -1,

  Unauthorized = 401,
  Forbidden = 403,
  RequestTimeout = 408,
  MethodNotAllowed = 405,

  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,

  BearerAuthorizationInvalid = -1001,
  ParameterError = -1003,

  AccessTokenInvalid = -2002,
  RefreshTokenInvalid = -2003,
  DatabaseQueryError = -2004,
  AccessTokenExpired = -2005,
  RefreshTokenExpired = -2006,

  UserNotHasAdminRole = 1001,
  UserNotExists = 1010
}

export const BizMessage = {

  [Biz.ParameterError]: '参数错误'

} as const;



export const toBizErrorMsg = (data: RXApiBasicResponse, msg?: string) => {
  if (typeof data !== 'object') return '';
  if (!Reflect.has(data, 'code')) return '';

  const definitionMsg = BizMessage[data.code];

  if (definitionMsg) return definitionMsg;
  return msg ?? data.message;
}
