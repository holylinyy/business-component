export const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
}

export const BAR_MAP = {
  [DIRECTION.VERTICAL]: {
    key: DIRECTION.VERTICAL,
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  [DIRECTION.HORIZONTAL]: {
    key: DIRECTION.HORIZONTAL,
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
}
