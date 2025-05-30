import { rxApiPost } from '../definition';
import type { RXApiPromiseLike } from '../definition';

// ==================================================================================

export type LoginResponse = {
  readonly tokens: {
    /**
     * 权限访问控制凭证
     */
    readonly access_token: string;

    /**
     * 资源访问控制凭证
     */
    readonly refresh_token: string;
  }
}

export interface LoginApiPayload {
  /**
   * 邮箱地址
   */
  readonly email: string;

  /**
   * 密码
   */
  readonly password: string;
}

export type LoginApiPromise = RXApiPromiseLike<LoginResponse, null>;

/**
 * 用户登录 Api
 */
export const loginApi = (payload: LoginApiPayload) => {
  return rxApiPost<LoginResponse, {}>('/api/v1/user/login', {
    hConfig: {
      needAuth: false
    },
    data: {
      email: payload.email,
      password: payload.password
    }
  });
}


// ==================================================================================
export interface UserinfoResponse {

}

export interface UserinfoApiPayload {

}

export type UserInfoApiPromise = RXApiPromiseLike<UserinfoResponse, null>;

export const userinfoApi = (payload: UserinfoApiPayload) => {
  return rxApiPost<UserinfoResponse, null>('/api/v1/user/get_user_info');
}


// ==================================================================================
export interface RegisterResponse {

}

export interface RegisterApiPayload {
  readonly email: string;
  readonly username?: string;
  readonly password: string;
}

export type RegisterApiPromise = RXApiPromiseLike<RegisterResponse, null>;

export const registerApi = (payload: RegisterApiPayload) => {
  return rxApiPost<RegisterResponse, null>('/api/v1/user/register', {
    hConfig: {
      needAuth: false
    },
    data: payload
  })
}
