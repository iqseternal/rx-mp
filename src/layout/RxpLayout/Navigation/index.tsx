import { Menu, Spin } from 'antd';
import { memo } from 'react';

import { Resizable } from 're-resizable';

export const Navigation = memo(() => {

  return (
    <Resizable
      className='!h-full w-auto'
      handleStyles={{
        right: {
          width: '2px',
          backgroundColor: 'blue',
          right: '0px'
        }
      }}
      maxWidth={256}
      minWidth={64}
    >
      <div
        className='w-full h-full'
      >
        <Menu
          theme='dark'
          mode='inline'
          triggerSubMenuAction='click'
          className='h-full'
          inlineIndent={20}
          subMenuOpenDelay={0.2}
          items={[
            {
              label: 'Dash',
              key: 'dash',
              icon: (
                <div>

                  HSPAAA
                </div>
              ),
            }
          ]}
        />
      </div>
    </Resizable>
  )
})

export const NavigationWrapper = memo(() => {

  return (
    <Navigation />
  )
})

export default NavigationWrapper;
