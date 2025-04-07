import type { ProxyConfig } from '@rsbuild/core';

export const proxy: ProxyConfig = {
  '/rx-api/': {
    pathRewrite: (pathname) => {
      if (pathname.startsWith('/rx')) return pathname.replace('/rx-api', '');
      return pathname;
    },
    changeOrigin: true,
    // target: 'http://oupro.cn:3000',
    target: 'http://localhost:3000',
  }
}

export const defineProxy = (): ProxyConfig => {

  return proxy;
}
