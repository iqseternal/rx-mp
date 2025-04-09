import { usePresentRoute } from '@/router';
import { memo, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { cssTransitionClassNames, parsePriorityRouteParams } from './definition';
import { useNavigate } from 'react-router-dom';

import IconFont from '@/components/IconFont';

export const BreadCrumbs = memo(() => {
  const route = usePresentRoute();
  const navigate = useNavigate();

  const priorityRouteParams = useMemo(() => parsePriorityRouteParams(route.current), [route.current]);

  return (
    <div
      className='w-full shadow-sm'
    >
      <TransitionGroup
        className={'flex gap-x-1'}
      >
        {priorityRouteParams.map((item, index) => {
          const { title, fullPath, icon, nodeRef } = item;

          return (
            <CSSTransition
              timeout={{
                enter: 300,
                exit: 100
              }}
              key={fullPath}
              classNames={cssTransitionClassNames}
              nodeRef={nodeRef}
            >
              <div
                key={fullPath}
                className='flex gap-x-0.5 cursor-pointer select-none'
                ref={nodeRef}
                onClick={() => {
                  if (location.pathname !== fullPath) navigate(fullPath);
                }}
              >
                {index !== 0 && (
                  <>
                    /&nbsp;
                  </>
                )}
                {icon && (<IconFont icon={icon} />)}
                <span>{title}</span>
              </div>
            </CSSTransition>
          )
        })}
      </TransitionGroup>
    </div>
  )
})

export const BreadCrumbsWrapper = memo(() => {

  return (
    <BreadCrumbs />
  )
})

export default BreadCrumbsWrapper;
