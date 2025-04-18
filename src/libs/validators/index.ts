import { defineRawType } from '@suey/pkg-utils';
import type { RuleObject } from 'antd/es/form';

export function isString(value: any): value is string {
  return (typeof value === 'string');
}

export function isEmptyString(value: any): value is string {
  return isString(value) && value.trim() === '';
}

export function isNotEmptyString(value: any): value is string {
  return isString(value) && value.trim() !== '';
}

export function isSpecifyLengthString(value: any, min: number, max: number): value is string {
  if (!isString(value)) return false;
  const length = value.length;
  return length >= min && length <= max;
}

export function isMinLengthString(value: any, length: number): value is string {
  if (!isString(value)) return false;
  return value.length >= length;
}

export function isMaxLengthString(value: any, length: number): value is string {
  if (!isString(value)) return false;
  return value.length <= length;
}

/**
 * 验证字符串作为名称, 是否是有效字符. 此函数屏蔽了部分特殊字符
 */
export function isValidCharacterName(value: any): value is string {
  if (!isString(value)) return false;
  const regex = /^(?!.*[<>{}[\]()$&*%#@!])[\u4e00-\u9fa5a-zA-Z0-9_\-~·`]+$/;
  return regex.test(value);
}
