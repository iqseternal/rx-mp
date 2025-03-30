import { Outlet, useLocation } from 'react-router-dom';
import { memo, useEffect } from 'react';
import { UnlockTwoTone, UserAddOutlined } from '@ant-design/icons';
import { useWindowInnerSize } from '@/libs/hooks';
import { Button, Popover } from 'antd';

import Widget from '@/components/Widget';

/**
 * 根组件的布局, 让每一个页面都受控于 ReactRouter
 * 可以利用本组件为整个 App 添加动画等.
 */
const RootLayout = memo(() => {


  return <Outlet />
})

export default RootLayout;
