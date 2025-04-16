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
import IconFont from '@/components/IconFont';

export interface OpenHistoryProps {
  readonly className?: string;
}

export const OpenHistory = memo<OpenHistoryProps>((props) => {
  const { className } = props;

  const presentRoute = usePresentRoute();
  const navigate = useNavigate();
  const history = useHistoryStore(store => store.history);

  return (
    <div
      className={classnames(
        'w-full bg-white px-2 flex gap-x-1 py-1',
        className
      )}
    >
      {history && history.filter(item => !item.hiddenInOpenHistory).map((item, index) => {

        return (
          <Tag
            icon={<CiCircleOutlined />}
            key={item.fullPath}
            color={(
              presentRoute.current?.meta.fullPath === item.fullPath ? 'blue-inverse' : 'default'
            )}
            className={classnames(
              'py-0.5 px-1.5 cursor-pointer',
              presentRoute.current?.meta.fullPath === item.fullPath && 'text-blue-300'
            )}
            onClick={() => {
              if (item.fullPath) {
                navigate(item.fullPath)
              }
            }}
          >
            {item.title}

            <Dropdown

              menu={{
                items: []
              }}
            >
              <IconFont
                icon='CloseCircleOutlined'
              />
            </Dropdown>
          </Tag>
        )
      })}
    </div>
  )
})

export const OpenHistoryWrapper = memo<OpenHistoryProps>((props) => {
  const presentRoute = usePresentRoute();

  useLayoutEffect(() => {
    if (!presentRoute.current) return;
    pushHistory(presentRoute.current.meta);
  }, [presentRoute.current]);

  return (
    <OpenHistory
      {...props}
    />
  )
})

export default OpenHistoryWrapper;
