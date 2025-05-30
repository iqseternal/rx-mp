import { REQ_METHODS, createApiRequest, ApiPromiseResultTypeBuilder, AxiosError, RequestConfig, toNil, type AxiosResponse } from '@suey/pkg-utils';
import { StringFilters } from '@/libs/common';
import { rxUpdateAccessTokenApi } from '../modules/auth';
import { ckSet } from '@suey/pkg-web';
import { bus } from '@/libs/bus';

import NProgress from 'nprogress';

/**
 * 请求 hConfig 配置
 */
export interface RXApiHConfig {
  /**
   * 默认都需要认证
   * @default true
   */
  readonly needAuth?: boolean;
}

/**
 * 基本响应结构体的内容
 */
export interface RXApiBasicResponse {
  /**
   * 状态码
   */
  readonly code: 0 | number;

  /**
   * 响应描述
   */
  readonly message: string;

  /**
   * 返回数据, 具有 data 定义
   */
  readonly data: any;

  /**
   * 更多的响应体修饰
   */
  readonly more?: {

    /**
     * 响应数据是否被压缩了
     */
    readonly pako?: boolean;
  }
}

export interface RXApiSuccessResponse extends RXApiBasicResponse {

}

export interface RXApiFailResponse extends RXApiBasicResponse {

  /**
   * 更多的错误信息
   */
  readonly INNER: {
    /**
     * 栈信息
     */
    readonly stack: string;

    readonly name: AxiosError<Omit<RXApiFailResponse, 'INNER'>, any>['name'];

    readonly config: AxiosError<Omit<RXApiFailResponse, 'INNER'>, any>['config'];

    readonly request: AxiosError<Omit<RXApiFailResponse, 'INNER'>, any>['request'];

    readonly response: AxiosError<Omit<RXApiFailResponse, 'INNER'>, any>['response'];
  }
}

/**
 * RApiPromiseLike, 可以通过 then, catch 获得不同的相应数据类型提示
 * 也可以通过 toNil 获取类型
 *
 * ```ts
 * declare const pr: RApiPromiseLike<number,  string>;
 * const [err, res] = await toNil(pr);
 * if (err) {
 *   console.log(err.descriptor);
 *   return;
 * }
 * res;
 * //
 * ```
 */
export type RXApiPromiseLike<Success = null, Fail = null> = ApiPromiseResultTypeBuilder<RXApiSuccessResponse, RXApiFailResponse, Success, Fail>;

/**
 * 判断响应体是否是符合 RX 得 response
 */
export const isRXAxiosResponse = (response: AxiosResponse): response is AxiosResponse<RXApiSuccessResponse, RXApiFailResponse> => {
  if (
    response.data &&
    Reflect.has(response.data, 'code') &&
    Reflect.has(response.data, 'data')
  ) return true;
  return false;
}

const rxApiConfig: RequestConfig<RXApiHConfig> = {
  timeout: 5000,
};

const rxApiRequest = createApiRequest<RXApiHConfig, RXApiSuccessResponse, RXApiFailResponse>('/rx-api', rxApiConfig, {
  async onFulfilled(config) {

  },
}, {
  async onFulfilled(response) {
    if (!isRXAxiosResponse(response)) return response;

    if (response.data.code === 0) return response;

    return bus.invoker.invoke('rx-api-err-distributor', response);
  },
  onRejected(err) {
    return Promise.reject<RXApiFailResponse>({
      code: -1,
      data: err.response?.data,
      message: StringFilters.toValidStr(err.message, '未知错误'),
      INNER: {
        stack: err.stack,
        config: err.config,
        request: err.request,
        response: err.response,
        name: err.name
      },
    } as RXApiFailResponse);
  }
})

export const { apiGet: rxApiGet, apiPost: rxApiPost, request: rxRequest, createApi: rxCreateApi } = rxApiRequest;

export const rxApiPut = rxCreateApi(REQ_METHODS.PUT);

export const rxApiDelete = rxCreateApi(REQ_METHODS.DELETE);

export const rxApiPatch = rxCreateApi('PATCH');
