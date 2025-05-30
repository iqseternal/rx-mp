import { isRXAxiosResponse } from '@/api';
import type { RXApiFailResponse, RXApiSuccessResponse } from '@/api';
import { rxUpdateAccessTokenApi } from '@/api/modules';
import { Biz } from '@/error/code';
import { bus } from '@/libs/bus';
import { request, toNil } from '@suey/pkg-utils';
import type { AxiosResponse } from '@suey/pkg-utils';
import { useTokensStore } from '@/stores';

/**
 *
 * 分发器
 */
bus.invoker.handle('rx-api-err-distributor', async response => {
  if (!isRXAxiosResponse(response)) return response;

  const data = response.data;

  // 资源访问凭证过期或者无效 ?
  if (
    [
      Biz.BearerAuthorizationInvalid,
      Biz.AccessTokenExpired,
      Biz.AccessTokenInvalid
    ].includes(data.code)
  ) return bus.invoker.invoke('rx-api-err:unauthorized-resource', response);

  return Promise.reject(data);
})

/**
 * rx-api-err: 资源访问没有权限
 */
bus.invoker.handle('rx-api-err:unauthorized-resource', async response => {
  // 更新资源访问凭证
  const [authErr, authRes] = await toNil(rxUpdateAccessTokenApi({}));
  if (authErr || authRes.data.code !== Biz.Success) {
    useTokensStore.removeAccessToken();
    useTokensStore.removeRefreshToken();
    return Promise.reject(response);
  }

  useTokensStore.setAccessToken(authRes.data.data);

  // 重试请求
  const [err, res] = await toNil(request<RXApiSuccessResponse, RXApiFailResponse>(response.config));
  if (err) return Promise.reject(err.reason);

  if (!isRXAxiosResponse(res as AxiosResponse)) return Promise.reject(res);
  if (res.data.code !== Biz.Success) return Promise.reject(res);

  return res;
})
