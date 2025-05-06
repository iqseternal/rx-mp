import { memo } from 'react';
import { Badge, Dropdown } from 'antd';
import { LockOutlined, PoweroffOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTokensStore } from '@/stores';
import { useNetwork } from '@/libs/hooks';

import Widget from '@/components/Widget';
import styles from './index.module.scss';
import IconFont from '@/components/IconFont';

export const UserAvatar = memo(() => {
  const navigate = useNavigate();

  const { online } = useNetwork();

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
      <Widget>
        <Badge
          dot={true}
          color={online ? 'green' : 'gold'}
          size='small'
          offset={[0, 4]}
        >
          <IconFont
            icon='UsergroupAddOutlined'
          />
        </Badge>
      </Widget>
    </Dropdown>
  )
})

export const UserAvatarWrapper = memo(() => {

  return (
    <UserAvatar />
  )
})

export default UserAvatarWrapper;
