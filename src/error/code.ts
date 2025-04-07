
export const ErrorCode = {
  [0]: '操作成功',
  [-1]: '失败',

  [401]: '权限未定义',
  [403]: '操作被拒绝',

  [408]: '请求超时',
  [405]: '请求不被允许',

  [500]: '服务错误',
  [501]: '服务未实现',
  [502]: '网关错误',

  [-1001]: '权限未定义',


  [-2002]: '权限访问凭证未定义',
  [-2003]: '资源访问凭证未定义',
  [-2004]: '数据库查询失败',
  [-2005]: '权限访问凭证已过期',
  [-2006]: '资源访问凭证已过期',

  [1001]: '用户为拥有管理员权限',

  [1010]: '用户不存在'
}

export const toErrorMsg = (code: number) => {
  if (ErrorCode[code]) {
    return ErrorCode[code];
  }
  return '';
}
