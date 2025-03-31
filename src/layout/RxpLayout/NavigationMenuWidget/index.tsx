
import { memo } from 'react';

import Widget from '@/components/Widget';

export const NavigationMenuWidget = memo(() => {


  return (
    <Widget
      icon='MenuOutlined'
      tipText='菜单折叠'
    />
  )
})

export default NavigationMenuWidget;
