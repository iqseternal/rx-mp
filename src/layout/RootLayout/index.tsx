import { Outlet, useLocation } from 'react-router-dom';
import { memo, useEffect, useRef, useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { rootCssTransitionClassNames } from './definition';

import Widget from '@/components/Widget';

/**
 * 根组件的布局, 让每一个页面都受控于 ReactRouter
 * 可以利用本组件为整个 App 添加动画等.
 */
const RootLayout = memo(() => {

  const rootContainerRef = useRef<HTMLDivElement>(null);

  return (
    <SwitchTransition mode='out-in'>
      <CSSTransition
        key={'rootLayout'}
        timeout={300}
        appear={true}
        in
        classNames={rootCssTransitionClassNames}
        enter={true}
        exit={false}
        unmountOnExit={false}
        nodeRef={rootContainerRef}
      >
        <div
          ref={rootContainerRef}
          className='w-full h-full'
        >
          <Outlet />
        </div>
      </CSSTransition>
    </SwitchTransition>
  )
})

const RootLayoutWrapper = memo(() => (<RootLayout />));

export default RootLayoutWrapper;
