import { Layout, Menu } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRetrieveRoute, usePresentRoute, getRouteFromFullPath } from '@/router';
import { useShallowReactive } from '@/libs/hooks';
import { IeOutlined } from '@ant-design/icons';
import type { MenuItemType } from 'antd/es/menu/interface';
import type { RouteConfig } from '@/router/definition';
import { rxpBus } from '@/layout/RxpLayout/bus';
import { useRXPLayoutStore } from '@/layout/RxpLayout/stores/useRXPLayoutStore';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { classnames } from '@/libs/common';
import { navCssTransitionClassNames } from './definition';

import IconFont from '@/components/IconFont';
import styles from './index.module.scss';

export const Navigation = memo(forwardRef<HTMLDivElement>((props, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const presentRoute = usePresentRoute();

  const rxpRoute = useRetrieveRoute(routes => routes.rxpRoute);
  const rxpNavigationCollapsed = useRXPLayoutStore(store => store.status.rxpNavigationCollapsed);

  const [shallowMenuState] = useShallowReactive(() => ({
    openKeys: [] as string[]
  }))

  const menus = useMemo<MenuItemType[]>(() => {

    const revertRouteMenus = (routes: RouteConfig[]) => {
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
    }

    return revertRouteMenus(rxpRoute.children);
  }, [rxpRoute]);

  const autoSetOpenKeys = useCallback(() => {
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

    if (!useRXPLayoutStore.getState().status.rxpNavigationCollapsed) {
      generateOpenKeys(presentRoute.current.meta.parentFullPath);
    }

    shallowMenuState.openKeys = openKeys;
  }, []);

  useLayoutEffect(autoSetOpenKeys, [rxpNavigationCollapsed]);

  return (
    <nav
      className='w-full h-full z-30 sticky'
      ref={ref}
    >
      <Layout.Sider
        theme='dark'
        className='h-full overflow-y-auto'
        collapsible={false}
        breakpoint='md'
        collapsed={rxpNavigationCollapsed}
        onCollapse={(collapsed, type) => {
          useRXPLayoutStore.setState((store) => {
            store.status.rxpNavigationCollapsed = collapsed;
          })
        }}
      >
        <div
          className='h-full overflow-y-auto flex-col max-h-full flex'
        >
          <div
            className='w-full flex justify-center text-xl py-2 gap-x-2 text-[rgba(255,255,255,0.65)] overflow-x-hidden flex-nowrap h-max flex-none'
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
            className={classnames(
              'h-full flex-1 overflow-y-auto',
              styles.navigationMenu
            )}
            selectedKeys={[location.pathname]}
            openKeys={shallowMenuState.openKeys}
            onOpenChange={(openKeys) => {
              shallowMenuState.openKeys = openKeys;
            }}
            onSelect={(info) => {
              // shallowMenuState.selectedKeys = info.selectedKeys;
            }}
            onClick={(info) => {
              navigate(info.key);
            }}
            inlineIndent={20}
            subMenuOpenDelay={0.2}
            items={menus}
          />
        </div>
      </Layout.Sider>
    </nav>
  )
}))

export const NavigationWrapper = memo(() => {
  const navContainerRef = useRef<HTMLDivElement>(null);


  return (
    <SwitchTransition mode='out-in'>
      <CSSTransition
        key={'nav'}
        timeout={300}
        appear
        in
        classNames={navCssTransitionClassNames}
        enter
        exit
        unmountOnExit
        nodeRef={navContainerRef}
      >
        <Navigation
          ref={navContainerRef}
        />
      </CSSTransition>
    </SwitchTransition>

  )
})

export default NavigationWrapper;
