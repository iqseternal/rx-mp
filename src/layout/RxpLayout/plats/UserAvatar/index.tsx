import { memo } from 'react';
import { Dropdown, Space } from 'antd';
import { LockOutlined, PoweroffOutlined } from '@ant-design/icons';

import Widget from '@/components/Widget';
import styles from './index.module.scss';

export const UserAvatar = memo(() => {

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
            extra: (<></>)
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

export default UserAvatar;
