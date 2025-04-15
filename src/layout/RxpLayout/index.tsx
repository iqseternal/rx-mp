import { memo, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { metadata } from '@/libs/rxp-meta';
import { useAsyncEffect, useNormalState, useShallowReactive } from '@/libs/hooks';
import { toNil } from '@suey/pkg-utils';
import { rApis } from '@/api';
import { setTokens } from '@/storage/token';
import { ErrorBoundary } from 'react-error-boundary';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { workbenchesCssTransitionClassNames } from './definition';
import { usePresentRoute } from '@/router';
import { useTokensStore, useUserStore } from '@/stores';

import NavigationWrapper from './plats/Navigation';
import HeaderWrapper from '@/b-components/Header';
import Widget from '@/components/Widget';
import BreadCrumbsWrapper from './plats/BreadCrumbs';
import UserAvatarWrapper from './plats/UserAvatar';
import NavigationMenuWidget from './plats/NavigationMenuWidget';
import Fullscreen from './plats/Fullscreen';
import OpenHistoryWrapper from './plats/OpenHistory';
import ResourceAccessAuthGuard from '@/guards/ResourceAccessAuthGuard';

/**
 * 为什么需要这个组件, 因为需要做过渡动画, 当 location.pathname 发生变化时, 只需要更新这一小部分组件内容即可
 */
const RXPMainContainer = memo(() => {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const presentRoute = usePresentRoute();

  const mainRef = useRef<HTMLDivElement>(null);

  const [normalState] = useNormalState(() => ({
    windowTitle: void 0 as (undefined | string)
  }))

  useLayoutEffect(() => {
    if (!normalState.windowTitle) {
      normalState.windowTitle = window.document.title;
    }
  }, []);

  useEffect(() => {
    if (!presentRoute.current) return;
    window.document.title = presentRoute.current.meta.title ?? normalState.windowTitle ?? '';
  }, [presentRoute.current]);

  useEffect(() => {

    return () => {

      if (normalState.windowTitle) {
        window.document.title = normalState.windowTitle
      }
    }
  }, []);

  return (
    <SwitchTransition mode='out-in'>
      <CSSTransition
        timeout={300}
        in
        appear
        key={location.pathname}
        nodeRef={mainRef}
        enter
        exit
        unmountOnExit
        classNames={workbenchesCssTransitionClassNames}
      >
        <main
          className='overflow-x-hidden overflow-y-auto w-full h-full max-h-full px-1.5 py-1.5'
          ref={mainRef}
        >
          {currentOutlet}
        </main>
      </CSSTransition>

    </SwitchTransition>
  )
})

const RXPLayout = memo(() => {
  const RXPVerticalNavExternal = metadata.useMetadata('rxp.ui.layout.vertical.nav.external');
  const RXPVerticalNavInternal = metadata.useMetadata('rxp.ui.layout.vertical.nav.internal');

  return (

    <div
      className='w-full h-full flex flex-nowrap bg-slate-100 overflow-x-hidden'
    >
      {RXPVerticalNavExternal && RXPVerticalNavExternal.map((ExternalNavigation, index) => {
        return (
          <div
            className='h-full select-none'
            draggable={false}
            key={index}
          >
            <ExternalNavigation />
          </div>
        )
      })}

      <section
        className='w-full h-full flex flex-col overflow-x-hidden'
      >
        <HeaderWrapper
          className='w-full bg-white h-12 flex-none'
        />

        <OpenHistoryWrapper />

        <section
          className='w-full flex flex-nowrap h-full'
        >
          {RXPVerticalNavInternal && RXPVerticalNavInternal.map((InternalNavigation, index) => {
            return (
              <div
                className='h-full select-none'
                key={index}
                draggable={false}
              >
                <InternalNavigation />
              </div>
            )
          })}

          <RXPMainContainer />
        </section>
      </section>
    </div>
  )
})

const RXPLayoutWrapper = memo(() => {
  useLayoutEffect(() => {
    metadata.defineMetadata('ui.layout.header.left.content', NavigationMenuWidget);
    metadata.defineMetadataInVector('ui.layout.header.left.after', BreadCrumbsWrapper);

    metadata.defineMetadataInVector('rxp.ui.layout.vertical.nav.external', NavigationWrapper);

    metadata.defineMetadataInVector('ui.layout.header.right.before', Fullscreen);
    metadata.defineMetadata('ui.layout.header.right.content', UserAvatarWrapper);

    return () => {
      metadata.delMetadata('ui.layout.header.left.content');
      metadata.delMetadataInVector('ui.layout.header.left.after', BreadCrumbsWrapper);

      metadata.delMetadataInVector('rxp.ui.layout.vertical.nav.external', NavigationWrapper);

      metadata.delMetadataInVector('ui.layout.header.right.before', Fullscreen);
      metadata.delMetadata('ui.layout.header.right.content');
    }
  }, []);

  return (
    <ResourceAccessAuthGuard>
      <RXPLayout />
    </ResourceAccessAuthGuard>
  )
})

export default RXPLayoutWrapper;
