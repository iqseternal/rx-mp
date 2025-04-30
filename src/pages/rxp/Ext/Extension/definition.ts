
import type { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';

import styles from './index.module.scss';

export const extensionSwitchCssTransitionClassNames: CSSTransitionClassNames = {
  appear: styles.extensionSwitchAppear,
  appearActive: styles.extensionSwitchAppearActive,
  appearDone: styles.extensionSwitchAppearDone,
  enter: styles.extensionSwitchEnter,
  enterActive: styles.extensionSwitchEnterActive,
  enterDone: styles.extensionSwitchEnterDone,
  exit: styles.extensionSwitchExit,
  exitActive: styles.extensionSwitchExitActive,
  exitDone: styles.extensionSwitchExitDone
} as const;

