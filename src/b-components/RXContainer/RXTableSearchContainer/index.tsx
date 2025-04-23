import { classnames } from '@/libs/common';
import { forwardRef, memo } from 'react';
import type { ReactNode } from 'react';

export interface RXTableSearchContainerInstance extends HTMLDivElement {

}

export interface RXTableSearchContainerProps {

  className?: string;

  children?: ReactNode;
}

export const RXTableSearchContainer = memo(forwardRef<RXTableSearchContainerInstance, RXTableSearchContainerProps>((props, ref) => {
  const { className, children } = props;

  return (
    <div
      className={classnames(
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  )
}))
