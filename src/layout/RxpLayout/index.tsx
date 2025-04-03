import { memo, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { metadata } from '@/libs/rxp-meta';
import { Avatar } from 'antd';
import { toNil } from '@suey/pkg-utils';
import { useAsyncEffect } from '@/libs/hooks';
import { rApis } from '@/api';
import { setAccessToken, setRefreshToken, setTokens } from '@/storage/token';
import { ckSet, loSet } from '@suey/pkg-web';

import NavigationWrapper from './plats/Navigation';
import HeaderWrapper from '@/b-components/Header';
import Widget from '@/components/Widget';
import BreadCrumbsWrapper from './plats/BreadCrumbs';
import UserAvatar from './plats/UserAvatar';
import NavigationMenuWidget from './plats/NavigationMenuWidget';


const RXPLayout = memo(() => {

  const RXPVerticalNavExternal = metadata.useMetadata('rxp.ui.layout.vertical.nav.external');
  const RXPVerticalNavInternal = metadata.useMetadata('rxp.ui.layout.vertical.nav.internal');

  return (

    <div
      className='w-full h-full flex flex-nowrap'
    >
      {RXPVerticalNavExternal && RXPVerticalNavExternal.map((ExternalNavigation, index) => {
        return (
          <div
            className='h-full'
            key={index}
          >
            <ExternalNavigation />
          </div>
        )
      })}

      <section
        className='w-full h-full flex flex-col'
      >
        <HeaderWrapper
          className='w-full bg-white h-12'
        />

        <BreadCrumbsWrapper />

        <section
          className='w-full flex flex-nowrap h-full'
        >
          {RXPVerticalNavInternal && RXPVerticalNavInternal.map((InternalNavigation, index) => {
            return (
              <div
                className='h-full'
                key={index}
              >
                <InternalNavigation />
              </div>
            )
          })}

          <main
            className='overflow-x-hidden overflow-y-auto w-full h-full'
          >
            <Outlet />
          </main>
        </section>
      </section>
    </div>
  )
})


const RXPLayoutWrapper = memo(() => {

  useLayoutEffect(() => {
    metadata.defineMetadata('ui.layout.header.left.content', NavigationMenuWidget);

    metadata.defineMetadataInVector('rxp.ui.layout.vertical.nav.external', NavigationWrapper);
    metadata.defineMetadata('ui.layout.header.right.content', UserAvatar);

    return () => {
      metadata.delMetadata('ui.layout.header.left.content');

      metadata.delMetadataInVector('rxp.ui.layout.vertical.nav.external', NavigationWrapper);
      metadata.delMetadata('ui.layout.header.right.content');
    }
  }, []);

  useAsyncEffect(async () => {
    const [err, res] = await toNil(rApis.loginApi({
      email: 'sueyeternal@163.com',
      password: 'asdadasdas'
    }))

    if (err) {
      console.error(err.reason.message);
      return;
    }

    setTokens({
      accessToken: res.data.tokens.access_token,
      refreshToken: res.data.tokens.refresh_token,
    })

    const [err2, res2] = await toNil(rApis.userinfoApi({}));
    if (err2) {
      console.error(err2.reason.message);
      return;
    }
  }, []);

  return (
    <RXPLayout />
  )
})

export default RXPLayoutWrapper;
