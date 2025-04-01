
import { memo } from 'react';
import { rxpBus } from '@/layout/RxpLayout/bus';
import { useRXPLayoutStore } from '@/layout/RxpLayout/stores/useRXPLayoutStore';

import Widget from '@/components/Widget';

export const NavigationMenuWidget = memo(() => {
  const rxpNavigationCollapsed = useRXPLayoutStore((store) => store.status.rxpNavigationCollapsed);

  return (
    <Widget
      icon={(
        rxpNavigationCollapsed ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'
      )}
      tipText='菜单折叠'
      onClick={() => {
        useRXPLayoutStore.setState(store => {
          store.status.rxpNavigationCollapsed = !store.status.rxpNavigationCollapsed;
        })
      }}
    />
  )
})

export default NavigationMenuWidget;
