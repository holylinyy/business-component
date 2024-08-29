import { InjectionKey } from 'vue-demi'

export const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
}

export interface ScrollbarContext {
  scrollbarElement?: HTMLDivElement
  wrapElement?: HTMLDivElement
}

export const scrollbarContextKey: InjectionKey<ScrollbarContext> = Symbol(
  'scrollbarContextKey',
)

export const BAR_MAP = {
  [DIRECTION.VERTICAL]: {
    key: DIRECTION.VERTICAL,
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    oppositeSize: 'width',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
    direction2: 'bottom',
    direction3: 'right',
  } as const,
  [DIRECTION.HORIZONTAL]: {
    key: DIRECTION.HORIZONTAL,
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    oppositeSize: 'height',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
    direction2: 'right',
    direction3: 'bottom',
  } as const,
}
