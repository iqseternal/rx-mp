import { memo } from 'react';

import Widget from '@/components/Widget';

export const UserAvatar = memo(() => {

  return (
    <>
      <Widget
        icon='UsergroupAddOutlined'
      />

      <Widget
        icon='DropboxOutlined'
      />
    </>
  )
})

export default UserAvatar;
