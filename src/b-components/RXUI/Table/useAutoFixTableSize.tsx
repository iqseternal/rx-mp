import type { Ref, RefObject } from 'react';
import { useLayoutEffect } from 'react';
import { useEffect, useState } from 'react';
import { useDebounceHook, useThrottleHook } from '@/libs/hooks/useDebounce';
import { classnames } from '@/libs/common';
import type { TableRef } from 'antd/es/table';
import { useNormalState } from '@/libs/hooks/useReactive';

/**
 * 获取当前 Dom overflow Y 上是否一定含有 scroll 值
 * @param dom
 * @returns
 */
export function hasOverflowYScroll<T extends HTMLElement>(dom: T): boolean {

  const style = getComputedStyle(dom);

  return style.overflowY.includes('scroll');
}

/**
 * 获取当前 DOM 是否能够在垂直方向上滚动
 */
export function isScrollContainer<T extends HTMLElement>(dom: T): boolean {
  const style = window.getComputedStyle(dom);
  const overflowY = style.overflowY;

  return (
    overflowY.includes('auto') ||
    overflowY.includes('scroll')
  ) && dom.scrollHeight >= dom.clientHeight;
}

/**
 * 找到第一个垂直滚动的父级元素
 * @return
 */
export function getFirstScrollContainer<T extends HTMLElement>(dom: T): T | null {
  let currentElement: HTMLElement | null = dom;

  while (currentElement) {
    if (
      currentElement !== dom &&
      isScrollContainer(currentElement)
    ) {
      return currentElement as T;
    }
    currentElement = currentElement.parentElement;
  }

  return null;
}

/**
 * 获取元素的额外尺寸
 * @param element
 * @returns
 */
export const getElementMoreRect = (element: HTMLElement) => {
  const elementComputedStyle = getComputedStyle(element);

  const paddingTop = parseInt(elementComputedStyle.paddingTop);
  const paddingBottom = parseInt(elementComputedStyle.paddingBottom);
  const marginTop = parseInt(elementComputedStyle.marginTop);
  const marginBottom = parseInt(elementComputedStyle.marginBottom);
  const borderTop = parseInt(elementComputedStyle.borderTopWidth);
  const borderBottom = parseInt(elementComputedStyle.borderBottomWidth);

  return { paddingTop, paddingBottom, marginTop, marginBottom, borderTop, borderBottom };
}



/** 有关样式的类型声明 */
export namespace CSSTypes {
  /** 像素值 */
  export type PixelValue = `${number}px`;
  /** 百分比 */
  export type PercentageValue = `${number}%`;

  /** CSS Style 声明映射表 */
  export type CSSStylePropertyDeclaration = Omit<CSSStyleDeclaration, symbol | number>;
}

/** Css 值设置时得各种转换 */
export class CssValueConverts {
  /**
   * 将一个数字值转换为一个像素值
   * @param value
   */
  public static toPixel(value: number): CSSTypes.PixelValue;
  public static toPixel(value: string): CSSTypes.PixelValue;
  public static toPixel(value: number | string): CSSTypes.PixelValue {
    if (typeof value === 'string') {
      value = parseInt(value);
      if (Number.isNaN(value)) value = 0;
    }
    return value + 'px' as CSSTypes.PixelValue;
  }

  public static toPercentage(value: number | `${number}`): CSSTypes.PercentageValue {
    return `${value}%`;
  }
}

/** 在为 dom 设置样式属性值的时候会进行调用的转换函数, 可以将值转换为特定的格式并返回 */
export type CssValueSetterCovertFn<T extends unknown = any> = (value: T) => string;

/** 在获取 dom 样式的时候可以进行转换, 获得其自身想要的类型 */
export type CssValueGetterCovertFn<T = string> = (value: string) => T;

export type CSSValueGetterOptions<T> = {
  convert?: CssValueGetterCovertFn<T>;
}
/** 为 dom 设置样式属性值的选项 */
export type CssValueSetterOptions = {
  isImportant?: boolean;
  convert?: CssValueSetterCovertFn | CssValueSetterCovertFn[];
}

/**
 * 获取一个 dom 的 style 属性值
 * @param node
 * @param propertyName
 * @param options
 * @returns
 */
export const getCssVar = <T extends any = string, Key extends keyof CSSTypes.CSSStylePropertyDeclaration = keyof CSSTypes.CSSStylePropertyDeclaration>(node: HTMLElement, propertyName: Key, options: CSSValueGetterOptions<T> = {}) => {
  const str = node.style[propertyName] as string;

  if (options.convert) return options.convert(str);

  return str;
}

/**
 * 设置一个 dom 的 style 属性值
 * @param node
 * @param propertyName
 * @param value
 * @param options
 * @returns
 */
export const setCssVar = <Key extends keyof CSSTypes.CSSStylePropertyDeclaration>(node: HTMLElement, propertyName: Key, value: CSSTypes.CSSStylePropertyDeclaration[Key], options: CssValueSetterOptions = {}) => {
  let valueStr = value as string;

  if (Array.isArray(options.convert)) {
    options.convert.forEach(convertFn => {
      valueStr = convertFn(valueStr) as string;
    })
  }
  else if (typeof options.convert === 'function') valueStr = options.convert(valueStr);

  node.style[propertyName] = valueStr as any;
  // return node.style.setProperty(propertyName as string, valueStr, options.isImportant ? 'important' : '');
}

/**
 * 设置 dom 的多个 style 属性值
 * @param node
 * @param properties
 * @param options
 * @returns
 */
export const setCssVars = <Key extends keyof CSSTypes.CSSStylePropertyDeclaration>(node: HTMLElement, properties: Partial<CSSTypes.CSSStylePropertyDeclaration>, options: Omit<CssValueSetterOptions, 'isImportant'> = {}) => {
  return Object.keys(properties).forEach((propertyName) => {
    const value = properties[propertyName as Key];
    if (!value) return;

    setCssVar(node, propertyName as keyof CSSTypes.CSSStylePropertyDeclaration, value, {
      convert: options.convert
    })
  });
}

/**
 * 获取 storage 中存储的 autoFixSize 状态
 * @returns
 */
export const getStorageAutoFixSize = (): boolean => JSON.parse(localStorage.getItem('hooks__autoFixSize') ?? 'true');

/**
 * 设置 storage 中存储的 autoFixSize 状态
 * @returns
 */
export const setStorageAutoFixSize = (autoFix: boolean) => localStorage.setItem('hooks__autoFixSize', JSON.stringify(autoFix));

export interface AutoFixTableSizeProps<RecordType extends Record<string, unknown>> {
  autoFixSize?: boolean;

  /** 当前仅支持 antd */
  isAntd?: true;
  /** 检测到滚动容器后是否直接关闭滚动选项 */
  closeParentScrollBar?: boolean;
  /** 最小高度 */
  minScrollHeight?: number;
}

const AntTableClassName = 'div.rx-table';
const AntTableHeaderClassName = 'div.rx-table-header';
const AntTableContentClassName = 'div.rx-table-body';

/**
 * 是否自动调整 Table 尺寸以更好适应页面
 *
 * 思路：
 *  表格的尺寸由表格数据区域动态变化，然后刚好铺满父级的滚动区域即可
 *  于是乎，就是算这个高度
 *  高度 = 父级展示的高度 - 除开表格的其他元素的高度
 *
 * 1. 寻找滚动容器
 * 2. 寻找其他元素
 * 3. 计算高度，并为表格数据区域高度赋值
 *
 */
export function useAutoFixTableSize<RecordType extends Record<string, unknown>>(tableRef: RefObject<TableRef>, autoFixTableProps: AutoFixTableSizeProps<RecordType>) {
  const {
    autoFixSize = getStorageAutoFixSize(),

    // 被调整期间是否直接关闭滚动容器得滚动条: overflowY: 'hidden';
    closeParentScrollBar = true,

    // 数据表格的最小高度
    minScrollHeight = 300
  } = autoFixTableProps;

  // 这里的 state 只是一个能够存储数据的变量, 不需要它刷新组件, 因此不建议使用 useReactive.
  // 这里使用 useState 和当前是一样的效果
  const [state] = useNormalState(() => ({
    // 是否自动调整尺寸
    autoFixSize,

    // 滚动父级下需要减去高度的额外元素
    moreElement: [] as (HTMLElement)[],
    // 额外元素对应的尺寸
    moreH: [] as ({ value: number, isParent: boolean }[]),

    // 滚动容器
    scrollContainer: null as (null | HTMLElement),

    // moreElement通过map获得moreH的下标位置
    elementToIndexMap: new WeakMap<HTMLElement, { index: number; isParent: boolean; }>()
  }));

  // 同步 minScrollHeight
  useEffect(() => {
    // 关闭了修复功能, 直接退出
    if (!state.autoFixSize) return;

    // 没有设置 minScrollHeight 或者 值不和规范
    if (!minScrollHeight) return;

    // 不能获取到表格实例
    if (!tableRef.current?.nativeElement) return;

    // 表格实例, 因为 class 类名为 xxWrapper, 所以命名为 tableWrapper
    const tableWrapper = tableRef.current.nativeElement;

    //
    const antTable = tableWrapper.querySelector(AntTableClassName);
    if (!antTable) return;

    // 获取到表格数据区域
    const antTableContent = antTable.querySelector(AntTableContentClassName) as HTMLDivElement;
    if (!antTableContent) return;

    // 记录旧的值
    const oldMinHeight = antTableContent.style.minHeight;

    // 设置维护的最小值
    setCssVars(antTableContent, { minHeight: CssValueConverts.toPixel(minScrollHeight) });

    // 恢复之前的状态
    return () => {
      setCssVars(antTableContent, { minHeight: oldMinHeight })
    }
  }, [tableRef.current?.nativeElement, minScrollHeight]);

  // 维护流
  useEffect(() => {
    if (!tableRef.current?.nativeElement) return;

    const tableWrapper = tableRef.current.nativeElement;

    // 表头
    const antTableHeader = tableWrapper.querySelector(AntTableHeaderClassName) as HTMLDivElement;

    // 表格
    const antTable = tableWrapper.querySelector(AntTableClassName) as HTMLDivElement;

    if (!antTable || !antTableHeader) {
      console.error('useAutoFixTableSize: 正在运行插件, 但 DOM 元素不满足执行条件, 请检查脚本是否正确. (无法找到表头或者表格元素：div.ant-table-header | div.ant-table)');
      return;
    }

    // 表格数据内容区域, 需要维护的数据容器
    const antTableContent = antTable.querySelector(AntTableContentClassName) as HTMLDivElement;
    if (!antTableContent) {
      console.error('useAutoFixTableSize: 正在运行插件, 但 DOM 元素不满足执行条件, 请检查脚本是否正确. (无法找到数据区域 div.ant-table-body)');
      return;
    }

    // 记录最开始的滚动状态, 以恢复, 这里虽然这个 DOM 会随着组件刷新重新加载, 但是我并不确定这个 DOM 会不会被重新创建, 例如 memo
    const presetAntTableContentOverflowY = antTableContent.style.overflowY;
    // 让数据内容区域进行滚动
    setCssVars(antTableContent, { overflowY: 'auto' });

    // 表头 同步数据区域横向滚动, 如果表头横向过多, 那么随着数据区域的横向滚动而滚动, 这里不应该出现防抖或者节流, 滚动应该同步
    const headerSyncScrollX = () => {
      antTableHeader.scrollLeft = antTableContent.scrollLeft;
    }

    let presetScrollContainerOverflowY: string;
    // 查找一次滚动容器
    const getParentScrollContainer = (() => {
      if (!state.autoFixSize) return;
      if (state.scrollContainer) return;

      state.scrollContainer = getFirstScrollContainer(antTableContent);
      if (!state.scrollContainer) return;

      mutationObserver.observe(state.scrollContainer, { subtree: true, childList: true, attributes: true });
      resizeObserver.observe(state.scrollContainer);

      // 记录预设值
      presetScrollContainerOverflowY = getComputedStyle(state.scrollContainer).overflowY;

      // 关闭滚动条
      if (closeParentScrollBar) setCssVars(state.scrollContainer, { overflowY: 'hidden' });
      // 设置表格 header 在滚动区域具有 sticky 属性时, 会被容器 paddingTop 影响问题
      const scrollContainerPaddingTop = getComputedStyle(state.scrollContainer).paddingTop;

      setCssVars(antTableHeader, { top: scrollContainerPaddingTop.startsWith('-') ? scrollContainerPaddingTop.replace(/^-/, '') : `-${scrollContainerPaddingTop}` });
    });
    const autoGetParentScrollContainer = useDebounceHook(getParentScrollContainer, { wait: 20 });

    // 通过已有的额外元素列表, 计算出额外元素高度列表, 通过累计高度列表可以获取额外高度的总体尺寸
    const calcMoreH = () => {
      state.moreElement.forEach(element => {
        if (!state.scrollContainer) return;

        // 检查改元素是否被存在 Map 中, 通过 Map 获得它与数据区域的关系
        const elementIndex = state.elementToIndexMap.get(element);
        if (!elementIndex) return;

        const { index, isParent } = elementIndex;

        const {
          paddingBottom, paddingTop,
          marginBottom, marginTop,
          borderBottom, borderTop
        } = getElementMoreRect(element);

        if (!state.moreH[index]) state.moreH[index] = {} as any;
        const elementRect = element.getBoundingClientRect();

        // 消除, 如果 element 不是 scrollContainer 的子元素, 那么代表这个添加是错误的
        if (!state.scrollContainer.contains(element)) state.moreH[index].value = 0;
        // 代表该元素是数据区域的父级元素, 该元素的子树下存在数据滚动区域, 那么它自身的高度是不被计算, 应该计算它额外的高度
        else if (isParent) state.moreH[index].value = paddingTop + paddingBottom;
        // 是 scrollContainer, 并且子元素没有数据区域, 那么整个高度都是多余的
        else state.moreH[index].value = elementRect.height + borderTop + borderBottom + marginTop + marginBottom;
      })
    };

    const adjustHeader = () => {
      // 当开始维护高度尺寸的时候, 表头会错位一个滚动条像素, 如果数据区域没有滚动条, 那么自己也设置为不滚动
      if (antTableContent.clientHeight === antTableContent.scrollHeight) {
        if (hasOverflowYScroll(antTableHeader)) setCssVars(antTableHeader, { overflowY: 'unset' });
        return;
      }

      // 数据区域具有滚动条, 表头跟随设置
      if (!hasOverflowYScroll(antTableHeader)) setCssVars(antTableHeader, { overflowY: 'scroll' });
    }

    // 数据区域被调整时的上次状态
    let preAntTableContentClientHeight = 0;
    // 根据计算出的 state.storeH 直接调整维护数据区域表格尺寸
    const adjust = () => {
      if (!state.scrollContainer) return;
      const { paddingTop, paddingBottom } = getElementMoreRect(state.scrollContainer);

      const scrollContainerRect = state.scrollContainer.getBoundingClientRect();
      // 计算总的 more 高度
      const moreH = state.moreH.reduce((pre, cur) => pre + cur.value, paddingTop + paddingBottom);
      // 当前表格被 粗略维护应该设置的高度, 减去多余的高度, 再减去一个容错值
      const clientHeight = scrollContainerRect.height - moreH - 4;

      // 相同的高度, 不需要被调整
      if (preAntTableContentClientHeight === clientHeight) return adjustHeader();
      // 记录
      preAntTableContentClientHeight = clientHeight;

      // 如果额外的高度 与 最小设置高度之和会比滚动区域的可视高度更高, 代表这个滚动容器无法在不滚动的情况下展示子元素, 那么要开启它的滚动状态, 并且不用调整表格高度了
      if (moreH + minScrollHeight >= scrollContainerRect.height) {
        // 如果此时滚动容器不能滚动了, 那么需要重新开启滚动
        if (!isScrollContainer(state.scrollContainer)) setCssVars(state.scrollContainer, { overflowY: 'scroll' });
        // setCssVars(antTableContent, { maxHeight: CssValueConverts.toPixel(minScrollHeight) });
        return;
      }

      // 需要维护高度, 关闭 scrollContainer 的滚动状态
      if (closeParentScrollBar && isScrollContainer(state.scrollContainer)) setCssVars(state.scrollContainer, { overflowY: 'hidden' });
      // 设置维护高度
      setCssVars(antTableContent, { maxHeight: CssValueConverts.toPixel(clientHeight) });

      adjustHeader();
    }

    // 一次计算值和更新调整的流程
    const calcMoreHAndAdjust = () => {
      calcMoreH();
      adjust();
    }
    const autoCalcMoreHAndAdjust = useThrottleHook(calcMoreHAndAdjust, { wait: 4 });

    // useDebounceHook 对DOM得查询, 应该防抖, 查询出 moreHElement 列表, 并自动更新
    const getMoreElement = () => {
      // 从 startDom： antTableContent 开始, 向上查询
      const startDom = antTableContent;
      const startDomRect = startDom.getBoundingClientRect();

      // 寻找副作用 DOM, 他们的更改可能会引起当前表格的尺寸变化
      function findAdJustDom(dom: HTMLElement | null) {
        if (!state.scrollContainer) return;
        if (dom === null || dom.parentElement === null || dom === state.scrollContainer) return;

        const parent = dom.parentElement;

        for (let i = 0; i < parent.children.length; i++) {
          const element = parent.children[i];

          if (!(element instanceof HTMLElement)) continue;
          if (state.elementToIndexMap.has(element)) continue;
          if (element.tagName === 'COLGROUP') continue;
          if (element === startDom) continue;
          if (element === dom) {
            state.moreElement.push(element);
            state.elementToIndexMap.set(element, { index: state.moreElement.length - 1, isParent: true });
            continue;
          }

          // 元素脱离了文档流,跳过该元素
          const elementStyles = getComputedStyle(element);
          if (elementStyles.position.includes('absolute') || elementStyles.position.includes('fixed')) continue;

          const elementRect = element.getBoundingClientRect();
          // 该元素不在基准元素的正上方
          if (elementRect.left >= startDomRect.right || elementRect.right <= startDomRect.left) continue;

          state.moreElement.push(element);
          state.elementToIndexMap.set(element, { index: state.moreElement.length - 1, isParent: false });
          resizeObserver.observe(element);
        }

        // 向上找寻
        findAdJustDom(parent);
      }

      findAdJustDom(startDom);
      autoCalcMoreHAndAdjust();
    }
    const autoGetMoreElement = useDebounceHook(getMoreElement, { wait: 20 });

    // 当 moreHElement 被 resize 的时候, 需要调整数据区域
    const resizeObserver = new ResizeObserver(useThrottleHook(() => {
      requestAnimationFrame(autoCalcMoreHAndAdjust);
    }, {
      wait: 4
    }));

    // 当元素发生变化, 例如：新添了一个元素进来或者少了一个元素, 都需要重新计算, 这个只需要监听 scrollContainer 就可以
    const mutationObserver = new MutationObserver(useDebounceHook(() => {
      // 获取自定义类名不掉
      if (!antTable.className.includes('hooks__autoFixTableSize')) antTable.className = classnames(antTable.className, 'hooks__autoFixTableSize');

      autoGetParentScrollContainer();
      requestAnimationFrame(autoGetMoreElement);
    }, {
      wait: 4
    }));

    // 事件注册
    // 不出意外, 在第一次进行得时候就应该能够查询到滚动容器
    if (!state.scrollContainer) getParentScrollContainer();
    if (state.scrollContainer) {
      mutationObserver.observe(state.scrollContainer, { subtree: true, childList: true, attributes: true });
      resizeObserver.observe(state.scrollContainer);

      autoGetMoreElement();
    }

    window.addEventListener('resize', autoGetParentScrollContainer);
    window.addEventListener('resize', autoGetMoreElement);

    antTableContent.addEventListener('scroll', headerSyncScrollX);
    mutationObserver.observe(tableWrapper, { childList: true, subtree: true, attributes: false });

    return () => {
      setCssVars(antTableContent, { overflowY: presetAntTableContentOverflowY });

      antTableContent.removeEventListener('scroll', headerSyncScrollX);

      window.removeEventListener('resize', autoGetParentScrollContainer);
      window.removeEventListener('resize', autoGetMoreElement);

      resizeObserver.disconnect();
      mutationObserver.disconnect();

      if (state.scrollContainer && presetScrollContainerOverflowY) setCssVars(state.scrollContainer, { overflowY: presetScrollContainerOverflowY });

      state.moreElement = [];
      state.moreH = [];
      state.scrollContainer = null;
      state.elementToIndexMap = new WeakMap();
    }
  }, [tableRef.current?.nativeElement]);
}
