import { LoadingOutlined } from '@ant-design/icons';
import { classnames } from '@/libs/common';
import { theme, Tooltip, TooltipProps } from 'antd';
import type { IconKey, IconFontProps } from '@/components/IconFont';
import type { HTMLAttributes, MouseEventHandler, ReactNode, MouseEvent } from 'react';
import { memo, useCallback, useState, useMemo, forwardRef } from 'react';

import IconFont from '@/components/IconFont';

export interface WidgetProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 内部的 className
   */
  innerClassName?: string;

  /** 当前控件是否具有 hover 背景特性 */
  hasHoverStyle?: boolean;

  /** 当前控件展示的图标元素 */
  icon?: IconKey;
  iconAttrs?: IconFontProps;

  /**
   * 当前控件是否处于 loading 状态
   */
  loading?: boolean;

  /**
   * 处于 loading 状态时自定义展示 loading 元素
   */
  loadingContent?: ReactNode;

  /**
   * @default 'base'
   */
  size?: 'base' | 'small' | 'large';

  /**
   * 控件 Hover 之后展示的提示文本
   */
  tipText?: string;

  /**
   * 展示提示文本的 tooltip 的 attrs
   */
  tipAttrs?: TooltipProps;

  /** 是否禁用当前控件 */
  disabled?: boolean;
}

/**
 * 展示一个控件, 控件: 图标, 附带功能提示信息和事件
 */
export const Widget = memo(forwardRef<HTMLDivElement, WidgetProps>((props, ref) => {
  const {
    className,
    innerClassName,
    hasHoverStyle = true,
    icon,
    iconAttrs = {} as IconFontProps,
    size = 'base',
    disabled = false,
    loading = false,
    loadingContent = <LoadingOutlined />,
    children,
    tipText,
    tipAttrs = {},
    onClick,
    onDoubleClick,
    onContextMenu,
    ...realProps
  } = props;

  const [normalState] = useState(() => ({
    loading: false,
    disabled: false,

    onClick: (() => { }) as (MouseEventHandler<HTMLDivElement> | undefined),
    onDoubleClick: (() => { }) as (MouseEventHandler<HTMLDivElement> | undefined),
    onContextMenu: (() => { }) as (MouseEventHandler<HTMLDivElement> | undefined),
  }))

  if (normalState.loading !== loading) normalState.loading = loading;
  if (normalState.disabled !== disabled) normalState.disabled = disabled;
  if (normalState.onClick !== onClick) normalState.onClick = onClick;
  if (normalState.onDoubleClick !== onDoubleClick) normalState.onDoubleClick = onDoubleClick;
  if (normalState.onContextMenu !== onContextMenu) normalState.onContextMenu = onContextMenu;

  /**
   * 创建维护事件, 当 disabled 为 true 时, 将传递事件进行封装, 禁用执行
   * 即便有 css commonStyles.disabledPointerEvents 的支持, 但是也要从实际的执行层面解决禁用事件问题
   */
  const withSafeEvent = useCallback(<Event extends MouseEvent>(callbackGetter: (() => (MouseEventHandler<HTMLDivElement> | undefined))) => {

    return (e: Event): void => {
      if (normalState.disabled) return;
      // if (normalState.loading) return;
      const callback = callbackGetter();
      if (callback) callback(e as any);
    }
  }, []);

  const withDisabledClick = useMemo(() => {
    return withSafeEvent<MouseEvent<HTMLDivElement>>(() => normalState.onClick);
  }, []);

  const withDisabledDoubleClick = useMemo(() => {
    return withSafeEvent<MouseEvent<HTMLDivElement>>(() => normalState.onDoubleClick);
  }, []);

  const withDisabledContextMenu = useMemo(() => {
    return withSafeEvent<MouseEvent<HTMLDivElement>>(() => normalState.onContextMenu);
  }, []);

  return (
    <div
      className={classnames(
        'max-w-full max-h-full rounded-md text-[#636c76] overflow-hidden cursor-pointer select-none flex-none drop-shadow-sm flex justify-center items-center text-base',
        className,
        {
          ['select-none']: loading || disabled,
          ['hover:bg-[rgba(0,0,0,0.1)]']: !loading && hasHoverStyle,
        }
      )}
      ref={ref}
    >
      <Tooltip
        title={tipText}
        getPopupContainer={() => document.body}
        mouseEnterDelay={0.5}
        autoAdjustOverflow
        {...tipAttrs}
      >
        <div
          {...realProps}
          onClick={withDisabledClick}
          onDoubleClick={withDisabledDoubleClick}
          onContextMenu={withDisabledContextMenu}
          className={classnames(
            'flex items-center justify-center max-w-full max-h-full aspect-square',
            size === 'base' && 'w-7 h-7 text-[100%]',
            size === 'large' && 'w-8 h-8 text-[110%]',
            size === 'small' && 'w-6 h-6 text-[90%]',
            {
              ['pointer-events-none']: loading || disabled
            },
            innerClassName
          )}
        >
          {loading ? loadingContent : <>
            {(icon || iconAttrs.icon) ? (
              <IconFont
                {...iconAttrs}
                className={classnames(
                  'inline-flex overflow-hidden aspect-square items-center justify-center'
                )}
                style={{
                  lineHeight: '1em'
                }}
                icon={icon || iconAttrs.icon}
              />
            ) : (
              children
            )}
          </>}
        </div>
      </Tooltip>
    </div>
  )
}))

export default Widget;
