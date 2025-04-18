

import type { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';

import styles from './index.module.scss';

export const extensionCardCssTransitionClassNames: CSSTransitionClassNames = {
  appear: styles.extensionCardSwitchAppear,
  appearActive: styles.extensionCardSwitchAppearActive,
  appearDone: styles.extensionCardSwitchAppearDone,
  enter: styles.extensionCardSwitchEnter,
  enterActive: styles.extensionCardSwitchEnterActive,
  enterDone: styles.extensionCardSwitchEnterDone,
  exit: styles.extensionCardSwitchExit,
  exitActive: styles.extensionCardSwitchExitActive,
  exitDone: styles.extensionCardSwitchExitDone
} as const;
