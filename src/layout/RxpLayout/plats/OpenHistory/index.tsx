import type { RouteMeta } from '@/router/definition';
import { memo, useEffect, useLayoutEffect } from 'react';
import { create, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useLocation, useNavigate } from 'react-router-dom';
import { immer } from 'zustand/middleware/immer';
import { useHistoryStore, pushHistory, delHistory } from './definition';
import { usePresentRoute } from '@/router';
import { classnames } from '@/libs/common';
import { Dropdown, Tag } from 'antd';
import { CiCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';


import Widget from '@/components/Widget';
import styles from './index.module.scss';
import IconFont from '@/components/IconFont';

export interface OpenHistoryProps {
  readonly className?: string;
}

export const OpenHistory = memo<OpenHistoryProps>((props) => {
  const { className } = props;

  const presentRoute = usePresentRoute();
  const navigate = useNavigate();
  const history = useHistoryStore(store => store.history);

  useEffect(() => {
    if (!presentRoute.current) return;
    pushHistory(presentRoute.current.meta);
  }, [presentRoute.current]);

  return (
    <section
      className='w-full bg-white px-2 flex items-center justify-between select-none'
    >
      <div
        className={classnames(
          'flex gap-x-1 py-1 scroll-smooth overflow-y-hidden overflow-x-auto',
          className,
          styles.openHistoryContainer
        )}
      >
        {history && history.filter(item => !item.hiddenInOpenHistory).map((item, index) => {

          return (
            <Tag
              icon={(
                <IconFont
                  icon={item.icon || 'CiCircleOutlined'}
                />
              )}
              key={item.fullPath}
              color={(
                presentRoute.current?.meta.fullPath === item.fullPath ? 'blue-inverse' : 'default'
              )}
              className={classnames(
                'py-0.5 px-1.5 cursor-pointer',
                presentRoute.current?.meta.fullPath === item.fullPath && 'text-blue-300'
              )}

            >
              <div
                className='inline-flex justify-between items-center gap-x-1'
              >
                <span
                  onClick={() => {
                    if (item.fullPath) {
                      navigate(item.fullPath)
                    }
                  }}
                >
                  {item.title}
                </span>

                <Dropdown
                  menu={{
                    items: []
                  }}
                >
                  <IconFont
                    icon='CloseCircleOutlined'
                    onClick={() => {
                      if (item.fullPath === presentRoute.current?.meta.fullPath) return;
                      delHistory(item);
                    }}
                  />
                </Dropdown>
              </div>
            </Tag>
          )
        })}
      </div>

      <div
        className='pl-1 bg-white shadow-sm'
      >
        <Tag
          className='py-0.5 pl-1.5 cursor-pointer'
          icon={(
            <IconFont
              icon='ControlOutlined'
            />
          )}
        >
          XP
        </Tag>
      </div>
    </section>
  )
})

export const OpenHistoryWrapper = memo<OpenHistoryProps>((props) => {

  return (
    <OpenHistory
      {...props}
    />
  )
})

export default OpenHistoryWrapper;
