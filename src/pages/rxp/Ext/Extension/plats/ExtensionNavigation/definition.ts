

import type { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';

import styles from './index.module.scss';

export const navCssTransitionClassNames: CSSTransitionClassNames = {
  appear: styles.navSwitchAppear,
  appearActive: styles.navSwitchAppearActive,
  appearDone: styles.navSwitchAppearDone,
  enter: styles.navSwitchEnter,
  enterActive: styles.navSwitchEnterActive,
  enterDone: styles.navSwitchEnterDone,
  exit: styles.navSwitchExit,
  exitActive: styles.navSwitchExitActive,
  exitDone: styles.navSwitchExitDone
} as const;
