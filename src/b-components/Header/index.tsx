import { classnames } from '@/libs/common';
import { metadata } from '@/libs/rxp-meta';
import { memo } from 'react';

export interface HeaderProps {
  className?: string;
  /**
   * 方便自定义 Header 三区域的比例问题
   */
  classNames?: {
    left?: string;
    center?: string;
    right?: string;
  }
  styles?: {
    left?: React.CSSProperties;
    center?: React.CSSProperties;
    right?: React.CSSProperties;
  }
}

export const Header = memo((props: HeaderProps) => {
  const { className, classNames = {}, styles = {} } = props;

  const HeaderLeftBeforeContents = metadata.useMetadata('ui.layout.header.left.before');
  const HeaderLeftContent = metadata.useMetadata('ui.layout.header.left.content');
  const HeaderLeftAfterContents = metadata.useMetadata('ui.layout.header.left.after');

  const HeaderCenterBeforeContents = metadata.useMetadata('ui.layout.header.center.before');
  const HeaderCenterContent = metadata.useMetadata('ui.layout.header.center.content');
  const HeaderCenterAfterContents = metadata.useMetadata('ui.layout.header.center.after');

  const HeaderRightBeforeContents = metadata.useMetadata('ui.layout.header.right.before');
  const HeaderRightContent = metadata.useMetadata('ui.layout.header.right.content');
  const HeaderRightAfterContents = metadata.useMetadata('ui.layout.header.right.after');

  return (
    <div
      className={classnames(
        'w-full flex flex-nowrap justify-between items-center max-w-full pl-2 pr-2',
        className
      )}
    >
      <div
        className={classnames(
          'flex justify-start items-center flex-none',
          classNames.left
        )}
        style={styles.left}
      >
        {HeaderLeftBeforeContents && (
          <div className={'w-full flex justify-end items-center gap-x-2'}>
            {HeaderLeftBeforeContents.map((Content, index) => (<Content key={index} />))}
          </div>
        )}
        {HeaderLeftContent && (<HeaderLeftContent />)}
        {HeaderLeftAfterContents && (
          <div className={'w-full flex justify-end items-center gap-x-2'}>
            {HeaderLeftAfterContents.map((Content, index) => (<Content key={index} />))}
          </div>
        )}
      </div>

      <div
        className={classnames(
          'w-full flex justify-start items-center flex-1 overflow-x-hidden',
          classNames.center
        )}
        style={styles.center}
      >
        {HeaderCenterBeforeContents && (
          <div className={'lex justify-end items-center gap-x-2'}>
            {HeaderCenterBeforeContents.map((Content, index) => (<Content key={index} />))}
          </div>
        )}
        {HeaderCenterContent && (<HeaderCenterContent />)}
        {HeaderCenterAfterContents && (
          <div className={'flex justify-start items-center gap-x-2'}>
            {HeaderCenterAfterContents.map((Content, index) => (<Content key={index} />))}
          </div>
        )}
      </div>

      <div
        className={classnames(
          'flex justify-end flex-none items-center',
          classNames.right
        )}
        style={styles.right}
      >
        {HeaderRightBeforeContents && (
          <div className={'w-full flex justify-end items-center gap-x-2'}>
            {HeaderRightBeforeContents.map((Content, index) => (<Content key={index} />))}
          </div>
        )}
        {HeaderRightContent && (<HeaderRightContent />)}
        {HeaderRightAfterContents && (
          <div className={'w-full flex justify-end items-center gap-x-2'}>
            {HeaderRightAfterContents.map((Content, index) => (<Content key={index} />))}
          </div>
        )}
      </div>
    </div>
  )
})

export const HeaderWrapper = memo((props: HeaderProps) => {

  return (
    <Header
      {...props}
    />
  )
})

export default HeaderWrapper;
