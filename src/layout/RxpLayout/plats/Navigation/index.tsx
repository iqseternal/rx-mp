import { Layout, Menu } from 'antd';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetrieveRoute, usePresentRoute, getRouteFromFullPath } from '@/router';
import { useShallowReactive } from '@/libs/hooks';
import { IeOutlined } from '@ant-design/icons';
import type { MenuItemType } from 'antd/es/menu/interface';
import type { RouteConfig } from '@/router/definition';
import { rxpBus } from '@/layout/RxpLayout/bus';
import { useRXPLayoutStore } from '@/layout/RxpLayout/stores/useRXPLayoutStore';

import IconFont from '@/components/IconFont';

export const Navigation = memo(() => {
  const navigate = useNavigate();

  const rxpRoute = useRetrieveRoute(routes => routes.rxpRoute);
  const presentRoute = usePresentRoute();
  const rxpNavigationCollapsed = useRXPLayoutStore(store => store.status.rxpNavigationCollapsed);

  const [shallowMenuState] = useShallowReactive(() => ({
    selectedKeys: [] as string[],
    openKeys: [] as string[]
  }))

  const revertRouteMenus = useCallback((routes: RouteConfig[]) => {

    return routes.map(route => {
      return {
        key: route.meta?.fullPath,
        label: route.meta?.title || route.name,
        icon: (
          <div>
            {route.meta?.icon && <IconFont icon={route.meta.icon} />}
          </div>
        ),
        children: (
          (route.children && route.children.length !== 0)
            ? revertRouteMenus(route.children)
            : void 0
        )
      }
    })
  }, []);

  const menus = useMemo<MenuItemType[]>(() => revertRouteMenus(rxpRoute.children), [rxpRoute]);

  useLayoutEffect(() => {
    if (!presentRoute.current) return;

    const openKeys = [] as string[];
    const generateOpenKeys = (fullPath: string) => {
      const route = getRouteFromFullPath(fullPath);
      if (route) {
        openKeys.push(route.meta.fullPath);
        if (['', '/'].includes(route.meta.parentFullPath)) {
          return;
        }
        generateOpenKeys(route.meta.parentFullPath);
      }
    }

    if (shallowMenuState.selectedKeys[0] !== presentRoute.current.meta.fullPath) {
      shallowMenuState.selectedKeys = [presentRoute.current.meta.fullPath];
    }

    if (!useRXPLayoutStore.getState().status.rxpNavigationCollapsed) {
      generateOpenKeys(presentRoute.current.meta.parentFullPath);
    }

    shallowMenuState.openKeys = openKeys;
  }, [presentRoute.current]);

  return (
    <nav
      className='w-full h-full'
    >
      <Layout.Sider
        theme='dark'
        className='h-full'
        collapsible={false}
        collapsed={rxpNavigationCollapsed}
        onCollapse={(collapsed, type) => {
          useRXPLayoutStore.setState((store) => {
            store.status.rxpNavigationCollapsed = collapsed;
          })
        }}
      >
      <div
        className='w-full flex justify-center text-xl py-2 gap-x-2 text-[rgba(255,255,255,0.65)] overflow-x-hidden flex-nowrap'
      >
        <IeOutlined />
        {!rxpNavigationCollapsed && (
          <>
            RX-MP
          </>
        )}
      </div>

      <Menu
        theme='dark'
        mode='inline'
        triggerSubMenuAction='click'
        className='h-full'
        selectedKeys={shallowMenuState.selectedKeys}
        openKeys={shallowMenuState.openKeys}
        onOpenChange={(openKeys) => {
          shallowMenuState.openKeys = openKeys;
        }}
        onSelect={(info) => {

          shallowMenuState.selectedKeys = info.selectedKeys;
        }}
        onClick={(info) => {
          navigate(info.key);
        }}
        inlineIndent={20}
        subMenuOpenDelay={0.2}
        items={menus}
      />
      </Layout.Sider>
    </nav>
  )
})

export const NavigationWrapper = memo(() => {

  return (
    <Navigation />
  )
})

export default NavigationWrapper;
