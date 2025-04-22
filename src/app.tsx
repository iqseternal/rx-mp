import { ConfigProvider, App } from 'antd';
import type { ConfigProviderProps } from 'antd';
import { memo, useCallback, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import RXRouterWrapper from './router';
import REmpty from '@/components/Empty';
import styles from './app.module.scss';

/**
 * 在这里做根组件的渲染处理, 这里的 memo 有必要, 会避免一些不必要的重新渲染
 */
export const RXApp = memo(() => {
  return (
    <ConfigProvider
      componentDisabled={false}
      componentSize='middle'
      csp={{

      }}
      direction='ltr'
      getPopupContainer={() => document.body}
      getTargetContainer={() => window}
      iconPrefixCls={'anticon'}
      popupMatchSelectWidth={true}
      popupOverflow={'viewport'}
      prefixCls='rx'
      renderEmpty={() => <REmpty />}
      theme={{
        components: {
          Message: {

          },
          Card: {
            bodyPadding: 15
          },
          Button: {
            paddingInline: 10,
            controlHeight: 30,
          },
          Table: {
            cellPaddingInlineMD: 6,
            cellPaddingBlockMD: 8,
            stickyScrollBarBg: 'unset'
          },
          Alert: {
            defaultPadding: '6px 10px'
          },
          Modal: {

          },
          Pagination: {
            itemSize: 28,
            controlHeight: 30,
          },
          Select: {
            controlHeight: 30,
          }
        },
        cssVar: {
          prefix: 'rx'
        }
      }}
      button={{

      }}
      card={{
        style: {

        }
      }}
      alert={{
        className: 'mb-1'
      }}
      popover={{

      }}
      tooltip={{

      }}
      table={{

      }}
      message={{

      }}
      modal={{
        className: styles.modalRoot,
      }}
      variant='outlined'
    >
      <App
        className='w-full h-full'
        message={{
          maxCount: 5,
          getContainer: () => document.body
        }}
        notification={{
          maxCount: 5,
          getContainer: () => document.body,
          placement: 'bottomRight'
        }}
        style={{

        }}
      >
        <RXRouterWrapper />
      </App>

      <Toaster
        position='bottom-right'
      />
    </ConfigProvider>
  )
})

export const RXAppWrapper = memo(() => {

  return (
    <RXApp />
  )
})
