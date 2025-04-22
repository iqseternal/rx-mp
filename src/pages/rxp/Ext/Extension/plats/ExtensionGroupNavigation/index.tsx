import { App, Layout, Menu } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, type Key } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { navCssTransitionClassNames } from './definition';
import { useAsyncEffect, useShallowReactive } from '@/libs/hooks';
import { getExtensionGroupListApi, type GetExtensionGroupListApiResponse } from '@/api/modules';
import { toNil } from '@suey/pkg-utils';
import { classnames } from '@/libs/common';
import { toBizErrorMsg } from '@/error/code';
import { useExtensionStatusStore } from '../../store/useExtensionStatusStore';

import IconFont from '@/components/IconFont';
import styles from './index.module.scss';

export const ExtensionGroupNavigation = memo(forwardRef<HTMLDivElement>(() => {
  const { message } = App.useApp();

  const [shallowState] = useShallowReactive(() => ({
    extensionGroupList: [] as GetExtensionGroupListApiResponse[],
  }))

  const selectedKeys = useExtensionStatusStore(store => store.selectedKeys);

  useAsyncEffect(async () => {
    const [err, res] = await toNil(getExtensionGroupListApi({}));
    if (err) return;
    shallowState.extensionGroupList = res.data;
  }, []);

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
      className='w-full h-full'
      collapsible={false}
      breakpoint='xl'
    >
      <div
        className='w-full h-full flex flex-col overflow-y-auto overflow-x-hidden'
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
      </div>
    </Layout.Sider>
  )
}))

export const ExtensionGroupNavigationWrapper = memo(() => {

  const navContainerRef = useRef<HTMLDivElement>(null);

  return (
    <SwitchTransition mode='out-in'>
      <CSSTransition
        key={'internal_nav'}
        timeout={300}
        appear
        in
        classNames={navCssTransitionClassNames}
        enter
        exit
        unmountOnExit={true}
        nodeRef={navContainerRef}
      >
        <ExtensionGroupNavigation
          ref={navContainerRef}
        />
      </CSSTransition>
    </SwitchTransition>
  )
})

export default ExtensionGroupNavigationWrapper;

