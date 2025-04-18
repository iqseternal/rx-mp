

import type { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';

import styles from './index.module.scss';

export const navCssTransitionClassNames: CSSTransitionClassNames = {
  appear: styles.emergeFromLeftSwitchAppear,
  appearActive: styles.emergeFromLeftSwitchAppearActive,
  appearDone: styles.emergeFromLeftSwitchAppearDone,
  enter: styles.emergeFromLeftSwitchEnter,
  enterActive: styles.emergeFromLeftSwitchEnterActive,
  enterDone: styles.emergeFromLeftSwitchEnterDone,
  exit: styles.emergeFromLeftSwitchExit,
  exitActive: styles.emergeFromLeftSwitchExitActive,
  exitDone: styles.emergeFromLeftSwitchExitDone
} as const;
