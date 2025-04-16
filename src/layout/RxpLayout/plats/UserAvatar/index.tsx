import { memo } from 'react';
import { Dropdown } from 'antd';
import { LockOutlined, PoweroffOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTokensStore } from '@/stores';

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
            onClick: () => useTokensStore.removeAccessToken()
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
