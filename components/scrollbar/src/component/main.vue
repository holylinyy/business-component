<template>
  <div ref="scrollbarRef" :class="scrollbarKls">
    <div ref="wrapRef" :class="wrapKls" @scroll="onScroll">
      <div ref="viewRef" :class="viewKls">
        <slot></slot>
      </div>
    </div>
    <Bar :ratio="ratioY" vertical :size="height" :move="moveY" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue-demi'
import { useElementSize } from '@vueuse/core'
import Bar from './bar.vue'
import { GAP } from './constants'

export default defineComponent({
  components: {
    Bar,
  },
  props: {
    minSize: {
      type: Number,
      default: () => 20,
    },
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const scrollbarRef = ref<HTMLDivElement>()
    const wrapRef = ref<HTMLDivElement | null>(null)
    const viewRef = ref<HTMLDivElement | null>(null)
    const descKls = computed(() => {
      const prefix = 'hl-'
      return {
        main: prefix + 'main',
        wrap: prefix + 'wrap',
        view: prefix + 'view',
      }
    })
    const scrollbarKls = computed(() => {
      const kls: string[] = [
        descKls.value.main,
        'overflow-hidden',
        'h-full',
        'relative',
        'select-none',
      ]
      return kls
    })

    const { width: _wrapWidth, height: wrapHeight } = useElementSize(wrapRef)
    const { width: _viewWidth, height: viewHeight } = useElementSize(viewRef)

    const offsetWrapHeight = computed(() => {
      return wrapHeight.value - GAP
    })

    const originalHeight = computed(() => {
      return offsetWrapHeight.value ** 2 / viewHeight.value
    })

    const height = computed(() => {
      return Math.max(originalHeight.value, props.minSize)
    })

    const ratioY = computed(() => {
      return (
        originalHeight.value /
        (wrapHeight.value - originalHeight.value) /
        (height.value / (wrapHeight.value - height.value))
      )
    })

    const moveY = ref(0)

    // const ratioY = computed(() => {
    //   return originalHeight.value / (viewHeight.value - )
    // })

    watch(
      () => [wrapHeight.value, viewHeight.value],
      () => {
        console.log(111111, wrapHeight.value, viewHeight.value)
      },
    )

    // useResizeObserver(wrapRef, (entries) => {
    //   const entry = entries[0]
    //   const { width, height } = entry.contentRect
    //   console.log('wrapRef resizeObserver', 'width', width, 'height', height)
    // })

    const wrapKls = computed(() => {
      const kls: string[] = [
        descKls.value.wrap,
        'scrollbar-none',
        'h-full',
        'overflow-scroll',
      ]
      return kls
    })
    const viewKls = computed(() => {
      const kls: string[] = [descKls.value.view]
      return kls
    })

    const handleScroll = () => {
      if (!wrapRef.value) return
      moveY.value =
        (wrapRef.value.scrollTop / offsetWrapHeight.value) * ratioY.value
    }

    const onScroll = (e: Event) => {
      handleScroll()
      emit('scroll', {
        event: e,
      })
    }

    return {
      scrollbarRef,
      wrapRef,
      viewRef,
      scrollbarKls,
      wrapKls,
      viewKls,
      onScroll,
      originalHeight,
      moveY,
      ratioY,
      height,
    }
  },
})
</script>
