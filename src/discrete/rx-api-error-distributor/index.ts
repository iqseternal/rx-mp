
import { isRXAxiosResponse, type RXApiFailResponse, type RXApiSuccessResponse } from '@/api';
import { rxUpdateAccessTokenApi } from '@/api/modules';
import { bus } from '@/libs/bus';
import { setAccessToken } from '@/storage/token';
import { request, toNil, type AxiosResponse } from '@suey/pkg-utils';

/**
 *
 * 分发器
 */
bus.invoker.handle('rx-api-err-distributor', async response => {
  if (!isRXAxiosResponse(response)) return response;

  const data = response.data;

  // 资源访问凭证过期或者无效 ?
  if ([-2002, -2005].includes(data.code)) {
    // 更新资源访问凭证
    const [authErr, authRes] = await toNil(rxUpdateAccessTokenApi({}));
    if (authErr) return Promise.reject(data);
    setAccessToken(authRes.data);

    // 重试请求
    const [err, res] = await toNil(request<RXApiSuccessResponse, RXApiFailResponse>(response.config));
    if (err) return Promise.reject(err.reason);

    // 再次检查返回结果是否符合 RX 得 response
    if (isRXAxiosResponse(res as AxiosResponse)) {
      const data = res.data;
      if (data.code === 0) return Promise.resolve(data);
      return Promise.reject(data);
    }
  }

  return Promise.resolve(data);
})

