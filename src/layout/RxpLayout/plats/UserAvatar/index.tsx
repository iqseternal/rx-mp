import { memo } from 'react';
import { Dropdown, Space } from 'antd';
import { LockOutlined, PoweroffOutlined } from '@ant-design/icons';
import { retrieveRoutes } from '@/router';
import { useNavigate } from 'react-router-dom';
import { removeTokens } from '@/storage/token';

import Widget from '@/components/Widget';
import styles from './index.module.scss';

export const UserAvatar = memo(() => {
  const navigate = useNavigate();

  return (
    <Dropdown
      trigger={['click']}
      rootClassName={styles.userDropdownMenuRootWrapper}
      menu={{
        items: [
          {
            key: 'lock',
            icon: <LockOutlined />,
            label: (
              <span>
                锁定屏幕
              </span>
            ),
            extra: (<></>)
          },
          {
            key: 'logout',
            icon: <PoweroffOutlined />,
            label: (
              <span>
                退出登录
              </span>
            ),
            extra: (<></>),
            onClick: () => {
              removeTokens();
              const { loginRoute } = retrieveRoutes();
              navigate(loginRoute.meta.fullPath);
            }
          }
        ]
      }}
    >
      <Widget
        icon='UsergroupAddOutlined'
      />
    </Dropdown>
  )
})

export const UserAvatarWrapper = memo(() => {

  return (
    <UserAvatar />
  )
})

export default UserAvatarWrapper;
