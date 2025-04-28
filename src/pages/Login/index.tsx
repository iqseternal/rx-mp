import { rApis } from '@/api';
import { loginApi } from '@/api/modules';
import { retrieveRoutes } from '@/router';
import { useTokensStore, useUserStore } from '@/stores';
import { toNil } from '@suey/pkg-utils';
import { Button, message } from 'antd';
import { memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const Login = memo(() => {
  const navigate = useNavigate();

  const loginApi = useCallback(async () => {
    const [err, res] = await toNil(rApis.loginApi({
      email: 'sueyeternal@163.com',
      password: 'asdadasdas'
    }))

    if (err) {
      console.error(err.reason.message);
      return;
    }

    useTokensStore.setTokens({
      accessToken: res.data.tokens.access_token,
      refreshToken: res.data.tokens.refresh_token
    })

    const [err2, res2] = await toNil(rApis.userinfoApi({}));
    if (err2) {
      console.error(err2.reason.message);
      return;
    }

    const { rxpRoute } = retrieveRoutes();
    navigate(rxpRoute.meta.fullPath);
  }, []);

  useEffect(() => {
    if (useTokensStore.hasAccessToken()) {
      const { rxpRoute } = retrieveRoutes();
      navigate(rxpRoute.meta.fullPath, { replace: true });
    }
  }, []);

  return (

    <div>


      登录页面

      <Button
        onClick={loginApi}
      >
        GO TO DASH
      </Button>
    </div>
  )
})

export default Login;
