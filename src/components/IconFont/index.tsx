import { memo, forwardRef } from 'react';
import { Ansi } from '@suey/pkg-utils';

import type { default as iconInstance } from '@ant-design/icons';
import type { IconComponentProps } from '@ant-design/icons/lib/components/Icon';
import * as icons from '@ant-design/icons';

export type IconInstance = typeof iconInstance;
export type IconProps = Omit<IconComponentProps, 'ref'>;

export type IconRealKey = Exclude<keyof typeof icons, 'createFromIconfontCN' | 'default' | 'IconProvider' | 'setTwoToneColor' | 'getTwoToneColor'>;
export type IconKey = IconRealKey | `icon-${string}`;

export interface IconFontProps extends Partial<IconProps> {

  icon: IconKey;
}

/**
 * antd icon font
 * @param props
 * @returns
 */
export const IconFont = memo(forwardRef<HTMLDivElement, IconFontProps>((props, ref) => {
  const { icon, ...iconProps } = props;

  if (!icon) {
    Ansi.print(Ansi.red, `IconFont 组件 icon 参数传递错误`);
    return null;
  }

  const Icon = icons[props.icon];

  if (!Icon) return null;

  return (
    <Icon
      {...iconProps}
      ref={ref}
    />
  )
}));

export default IconFont;
