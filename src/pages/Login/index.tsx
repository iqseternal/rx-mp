import { loginApi } from '@/api/modules';
import { toErrorMsg } from '@/error/code';
import { toNil } from '@suey/pkg-utils';
import { useAsyncEffect, useRequest } from 'ahooks';
import { message } from 'antd';
import { memo } from 'react';


export const Login = memo(() => {


  return (

    <div>


      登录页面
    </div>
  )
})

export default Login;
