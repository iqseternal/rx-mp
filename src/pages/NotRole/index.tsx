import { Button } from 'antd';
import { memo } from 'react';
import { retrieveRoutes } from '@/router';
import { useNavigate } from 'react-router-dom';

import IconFont from '@/components/IconFont';

const NotRole = memo(() => {
  const navigate = useNavigate();

  return (

    <div>

      NotRole!

      <Button
        icon={<IconFont icon='BackwardOutlined' />}
        onClick={() => {
          const { loginRoute } = retrieveRoutes();
          navigate(loginRoute.meta.fullPath, { replace: true });
        }}
      >
        返回至登录
      </Button>

    </div>
  )
})

export default NotRole;
