import { rxApiPost } from '../definition';
import type { RApiPromiseLike } from '../definition';

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
  readonly email: string;
  readonly password: string;
}

export type LoginApiPromise = RApiPromiseLike<LoginResponse, null>;

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
export interface RegisterResponse {

}

export interface RegisterApiPayload {
  readonly email: string;
  readonly username?: string;
  readonly password: string;
}

export type RegisterApiPromise = RApiPromiseLike<RegisterResponse, null>;

export const registerApi = (payload: RegisterApiPayload) => {
  return rxApiPost<RegisterResponse, null>('/api/v1/user/register', {
    hConfig: {
      needAuth: false
    },
    data: payload
  })
}
