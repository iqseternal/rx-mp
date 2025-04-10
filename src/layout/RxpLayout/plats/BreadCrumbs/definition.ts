
import type { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';
import { createRef, type RefObject } from 'react';
import type { CompleteRouteConfig } from '@/router/definition';
import { getRouteFromFullPath } from '@/router';
import type { IconKey } from '@/components/IconFont';

import styles from './index.module.scss';

export const cssTransitionClassNames: CSSTransitionClassNames = {
  enter: styles.emergeFromLeftSwitchEnter,
  enterActive: styles.emergeFromLeftSwitchEnterActive,
  enterDone: styles.emergeFromLeftSwitchEnterDone,
  exit: styles.emergeFromLeftSwitchExit,
  exitActive: styles.emergeFromLeftSwitchExitActive,
  exitDone: styles.emergeFromLeftSwitchExitDone
} as const;


export type PriorityRouteParamItem = {
  readonly title: string;
  readonly fullPath: string;
  readonly icon?: IconKey;
  readonly nodeRef: RefObject<HTMLDivElement>;
}

/**
 * 解析面包屑所需要的有序路由列表参数
 */
export const parsePriorityRouteParams = (route?: CompleteRouteConfig): PriorityRouteParamItem[] => {
  if (!route) return [];
  if (!route.meta?.title) return [];

  const title = route.meta.title ?? '';
  const fullPath = route.meta.fullPath;
  const icon = route.meta.icon;
  const nodeRef = createRef<HTMLDivElement>();

  const item: PriorityRouteParamItem = {
    title: title,
    icon: icon,
    fullPath: fullPath,
    nodeRef: nodeRef
  };

  if (!route.meta.parentFullPath) return [item];

  const parentRoute = getRouteFromFullPath(route.meta.parentFullPath);
  const parentPaths = parsePriorityRouteParams(parentRoute);

  return [...parentPaths, item];
}

