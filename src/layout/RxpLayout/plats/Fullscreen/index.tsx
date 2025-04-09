import { useFullscreen, useShallowReactive } from '@/libs/hooks';
import { FullscreenOutlined } from '@ant-design/icons';
import { memo } from 'react';

import Widget from '@/components/Widget';

export const Fullscreen = memo(() => {
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(() => document.body);

  return (

    <Widget
      icon={isFullscreen ? 'FullscreenExitOutlined' : 'FullscreenOutlined'}
      tipText={isFullscreen ? '退出全屏' : '全屏'}
      onClick={toggleFullscreen}
    />
  )
})

export default Fullscreen;
