<template>
  <div
    ref="instance"
    class="absolute rounded-1 z-1"
    :style="barStyle"
    @mousedown="clickTrackHandler"
  >
    <div
      v-show="always || visible"
      ref="thumb"
      class="absolute bg-#18222c rounded-1 cursor-pointer"
      :style="thumbStyle"
      @mousedown="clickThumbHandler"
    ></div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  ref,
  toRef,
} from 'vue-demi'
import { BAR_MAP, DIRECTION, scrollbarContextKey } from './constants'
import { useEventListener } from '@vueuse/core'

export default defineComponent({
  props: {
    size: {
      type: Number,
      default: 0,
    },
    move: {
      type: Number,
      default: 0,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    ratio: {
      type: Number,
      required: true,
    },
    gap: {
      type: Number,
      default: 4,
    },
    width: {
      type: Number,
      default: 4,
    },
    offset: {
      type: Number,
      default: 4,
    },
    always: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const instance = ref<HTMLDivElement>()
    const thumb = ref<HTMLDivElement>()
    const thumbState = ref<Partial<Record<'X' | 'Y', number>>>({})
    const visible = ref(false)
    const scrollbar = inject(scrollbarContextKey)
    let cursorDown = false
    let cursorLeave = false
    let originalOnSelectStart: any
    const bar = computed(() => {
      return props.vertical
        ? BAR_MAP[DIRECTION.VERTICAL]
        : BAR_MAP[DIRECTION.HORIZONTAL]
    })
    const barStyle = computed(() => {
      return {
        [bar.value.direction]: props.gap + 'px',
        [bar.value.direction2]: props.gap + 'px',
        [bar.value.oppositeSize]: props.width + 'px',
        [bar.value.direction3]: props.offset + 'px',
      }
    })

    const thumbStyle = computed(() => {
      return {
        [bar.value.size]: props.size + 'px',
        transform: `translate${bar.value.axis}(${props.move * 100}%)`,
        [bar.value.oppositeSize]: '100%',
      }
    })

    const offsetRatio = computed(
      () =>
        // offsetRatioX = original width of thumb / current width of thumb / ratioX
        // offsetRatioY = original height of thumb / current height of thumb / ratioY
        // instance height = wrap height - GAP
        instance.value![bar.value.offset] ** 2 /
        scrollbar!.wrapElement![bar.value.scrollSize] /
        props.ratio /
        thumb.value![bar.value.offset],
    )

    const clickTrackHandler = (e: MouseEvent) => {
      if (!thumb.value || !instance.value || !scrollbar?.wrapElement) return

      const offset = Math.abs(
        (e.target as HTMLElement).getBoundingClientRect()[bar.value.direction] -
          e[bar.value.client],
      )
      const thumbHalf = thumb.value[bar.value.offset] / 2
      const thumbPositionPercentage =
        ((offset - thumbHalf) * 100 * offsetRatio.value) /
        instance.value[bar.value.offset]

      scrollbar.wrapElement[bar.value.scroll] =
        (thumbPositionPercentage *
          scrollbar.wrapElement[bar.value.scrollSize]) /
        100
    }

    const clickThumbHandler = (e: MouseEvent) => {
      e.stopPropagation()
      window.getSelection()?.removeAllRanges()
      startDrag(e)
      const el = e.currentTarget as HTMLDivElement
      if (!el) return
      thumbState.value[bar.value.axis] =
        el[bar.value.offset] -
        (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction])
    }
    const startDrag = (e: MouseEvent) => {
      e.stopImmediatePropagation()
      cursorDown = true
      document.addEventListener('mousemove', mouseMoveDocumentHandler)
      document.addEventListener('mouseup', mouseUpDocumentHandler)
      originalOnSelectStart = document.onselectstart
      document.onselectstart = () => false
    }

    const mouseMoveDocumentHandler = (e: MouseEvent) => {
      if (!instance.value || !thumb.value) return
      if (cursorDown === false) return
      const prevPage = thumbState.value[bar.value.axis]
      if (!prevPage) return

      const offset =
        (instance.value.getBoundingClientRect()[bar.value.direction] -
          e[bar.value.client]) *
        -1
      const thumbClickPosition = thumb.value[bar.value.offset] - prevPage
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100 * offsetRatio.value) /
        instance.value[bar.value.offset]
      scrollbar!.wrapElement![bar.value.scroll] =
        (thumbPositionPercentage *
          scrollbar!.wrapElement![bar.value.scrollSize]) /
        100
    }

    const mouseUpDocumentHandler = () => {
      cursorDown = false
      document.removeEventListener('mousemove', mouseMoveDocumentHandler)
      document.removeEventListener('mouseup', mouseUpDocumentHandler)
      restoreOnselectstart()
      if (cursorLeave) visible.value = false
    }

    const restoreOnselectstart = () => {
      if (document.onselectstart !== originalOnSelectStart)
        document.onselectstart = originalOnSelectStart
    }

    const mouseMoveScrollbarHandler = () => {
      cursorLeave = false
      visible.value = !!props.size
    }

    const mouseLeaveScrollbarHandler = () => {
      cursorLeave = true
      visible.value = cursorDown
    }

    useEventListener(
      toRef(scrollbar!, 'scrollbarElement'),
      'mousemove',
      mouseMoveScrollbarHandler,
    )
    useEventListener(
      toRef(scrollbar!, 'scrollbarElement'),
      'mouseleave',
      mouseLeaveScrollbarHandler,
    )

    onBeforeUnmount(() => {
      restoreOnselectstart()
      document.removeEventListener('mouseup', mouseUpDocumentHandler)
    })

    return {
      barStyle,
      thumbStyle,
      clickTrackHandler,
      clickThumbHandler,
      instance,
      thumb,
      visible,
    }
  },
})
</script>
