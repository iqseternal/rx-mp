import { App, Layout, Menu, Skeleton } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, type Key } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { navCssTransitionClassNames } from './definition';
import { useAsyncEffect, useShallowReactive } from '@/libs/hooks';
import { getExtensionGroupListApi, type GetExtensionGroupListApiResponse } from '@/api/modules';
import { toNil, toWaitPromise } from '@suey/pkg-utils';
import { classnames } from '@/libs/common';
import { toBizErrorMsg } from '@/error/code';
import { useExtensionStatusStore } from '../../store/useExtensionStatusStore';
import { useLocation } from 'react-router-dom';
import { animated, useTransition } from '@react-spring/web';

import IconFont from '@/components/IconFont';
import styles from './index.module.scss';

export const ExtensionGroupNavigation = memo(forwardRef<HTMLDivElement>(() => {
  const { message } = App.useApp();

  const [shallowState] = useShallowReactive(() => ({
    extensionGroupList: [] as GetExtensionGroupListApiResponse[],
    extensionGroupListLoading: false,
  }))

  const selectedKeys = useExtensionStatusStore(store => store.selectedKeys);

  const loadExtensionGroupList = useCallback(async () => {
    if (shallowState.extensionGroupListLoading) return;
    shallowState.extensionGroupListLoading = true;
    const [err, res] = await toNil(getExtensionGroupListApi({}));
    if (err) return;
    shallowState.extensionGroupList = res.data.list;
    shallowState.extensionGroupListLoading = false;
  }, []);

  useAsyncEffect(loadExtensionGroupList, []);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const extensionGroupId = search.get('extension_group_id');
    if (extensionGroupId) {
      useExtensionStatusStore.setState({ selectedKeys: [extensionGroupId] })
    }
  }, []);

  return (
    <Layout.Sider
      theme='light'
      className='w-full h-full sticky top-0 z-20'
      collapsible={false}
      breakpoint='xl'
    >

      <div
        className='w-full h-full px-0.5 flex flex-col overflow-y-hidden overflow-x-hidden'
      >
        <Skeleton
          active
          loading={shallowState.extensionGroupListLoading}
          paragraph={{
            rows: 21,
            width: 180
          }}
        >
          <div
            className='w-full h-11 flex-none'
          >

          </div>


          <Menu
            selectedKeys={selectedKeys}
            className={classnames(
              'h-full overflow-y-auto',
              styles.extensionGroupNavMenu
            )}
            items={shallowState.extensionGroupList.map(item => ({

              label: item.extension_group_name,
              key: item.extension_group_id,
              onClick: () => {
                useExtensionStatusStore.setState({ selectedKeys: [`${item.extension_group_id}`] })
              }
            }))}
          />
        </Skeleton>
      </div>
    </Layout.Sider>
  )
}))

export const ExtensionGroupNavigationWrapper = (() => {
  const location = useLocation();
  const isInternalNav = location.pathname === '/rxp/ext/extension';

  const transitions = useTransition(isInternalNav, {
    keys: isInternalNav ? 'internal_nav' : 'not_internal_nav',
    from: {
      opacity: 0,
      transform: 'translateX(-20px)',
      width: '0%',
      maxWidth: 0,
    },
    enter: {
      opacity: 1,
      transform: 'translateX(0%)',
      maxWidth: 1000
    },
    leave: {
      opacity: 0,
      transform: 'translateX(20px)',
      width: '0%',
      maxWidth: 0,
    },
    config: {
      duration: 300,
      easing: t => t * (2 - t)
    },
    exitBeforeEnter: true
  });

  return transitions((style, item) => (
    <animated.div
      style={{
        ...style,
        willChange: 'transform, opacity, width'
      }}
      className='h-full z-20'
    >
      {item && (
        <ExtensionGroupNavigation />
      )}
    </animated.div>
  ))
})

export default ExtensionGroupNavigationWrapper;

