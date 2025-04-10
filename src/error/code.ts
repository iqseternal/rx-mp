
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

  AccessTokenInvalid = -2002,
  RefreshTokenInvalid = -2003,
  DatabaseQueryError = -2004,
  AccessTokenExpired = -2005,
  RefreshTokenExpired = -2006,

  UserNotHasAdminRole = 1001,
  UserNotExists = 1010
}

export const BizMessage = {
  [Biz.Success]: '操作成功',
  [Biz.Failure]: '失败',

  [Biz.Unauthorized]: '权限未定义',
  [Biz.Forbidden]: '操作被拒绝',
} as const;


export const toErrorMsg = (code: number) => {
  if (BizMessage[code]) {
    return BizMessage[code];
  }
  return '';
}
