
import type { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';

import styles from './index.module.scss';

export const rootCssTransitionClassNames: CSSTransitionClassNames = {
  appear: styles.emergeFromTransparentAppear,
  appearActive: styles.emergeFromTransparentAppearActive,
  appearDone: styles.emergeFromTransparentAppearDone,
  enter: styles.emergeFromTransparentEnter,
  enterActive: styles.emergeFromTransparentEnterActive,
  enterDone: styles.emergeFromTransparentEnterDone,
  exit: styles.emergeFromTransparentExit,
  exitActive: styles.emergeFromTransparentExitActive,
  exitDone: styles.emergeFromTransparentExitDone
} as const;
