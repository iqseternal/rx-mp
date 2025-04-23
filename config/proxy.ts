import type { ProxyConfig } from '@rsbuild/core';

const proxy: ProxyConfig = {
  '/rx-api/': {
    pathRewrite: (pathname) => {
      if (pathname.startsWith('/rx-api')) return pathname.replace('/rx-api', '');
      return pathname;
    },
    changeOrigin: true,
    // target: 'http://rx-mp-server.oupro.cn/',
    target: 'http://localhost:3000',
  }
}

export const defineProxy = (): ProxyConfig => {

  return proxy;
}
