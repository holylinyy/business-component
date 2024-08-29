<template>
  <div ref="scrollbarRef" :class="scrollbarKls">
    <div ref="wrapRef" :class="wrapKls" @scroll="onScroll">
      <div ref="viewRef" :class="viewKls">
        <slot></slot>
      </div>
    </div>
    <Bar
      :always="always"
      :ratio="ratioY"
      :gap="gap"
      vertical
      :size="sizeHeight"
      :move="moveY"
    />
    <Bar
      :always="always"
      :ratio="ratioX"
      :gap="gap"
      :size="sizeWidth"
      :move="moveX"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, reactive, ref } from 'vue-demi'
import { useElementSize } from '@vueuse/core'
import Bar from './bar.vue'
import { klsPrefix } from '../../../constants'
import { scrollbarContextKey } from './constants'

export default defineComponent({
  components: {
    Bar,
  },
  props: {
    minSize: {
      type: Number,
      default: () => 20,
    },
    gap: {
      type: Number,
      default: () => 4,
    },
    always: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const scrollbarRef = ref<HTMLDivElement>()
    const wrapRef = ref<HTMLDivElement>()
    const viewRef = ref<HTMLDivElement>()
    const descKls = computed(() => {
      const prefix = klsPrefix.value + '-scrollbar-'
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
    provide(
      scrollbarContextKey,
      reactive({
        scrollbarElement: scrollbarRef,
        wrapElement: wrapRef,
      }),
    )

    const { width: wrapWidth, height: wrapHeight } = useElementSize(wrapRef)

    const offsetWrapHeight = computed(() => {
      return wrapHeight.value - props.gap * 2
    })
    const offsetWrapWidth = computed(() => {
      return wrapWidth.value - props.gap * 2
    })

    const originalHeight = computed(() => {
      if (!wrapRef.value) return 0
      return offsetWrapHeight.value ** 2 / wrapRef.value.scrollHeight
    })
    const originalWidth = computed(() => {
      if (!wrapRef.value) return 0
      return offsetWrapWidth.value ** 2 / wrapRef.value!.scrollWidth
    })

    const height = computed(() => {
      return Math.max(originalHeight.value, props.minSize)
    })
    const sizeHeight = computed(() => {
      return height.value + props.gap * 2 < offsetWrapHeight.value
        ? height.value
        : 0
    })

    const width = computed(() => {
      return Math.max(originalWidth.value, props.minSize)
    })

    const sizeWidth = computed(() => {
      return width.value + props.gap * 2 < offsetWrapWidth.value
        ? width.value
        : 0
    })

    const ratioY = computed(() => {
      return (
        originalHeight.value /
        (wrapHeight.value - originalHeight.value) /
        (height.value / (wrapHeight.value - height.value))
      )
    })

    const ratioX = computed(() => {
      return (
        originalWidth.value /
        (wrapWidth.value - originalWidth.value) /
        (width.value / (wrapWidth.value - width.value))
      )
    })

    const moveY = ref(0)
    const moveX = ref(0)
    const wrapKls = computed(() => {
      const kls: string[] = [
        descKls.value.wrap,
        'scrollbar-none',
        'h-full',
        'w-full',
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
      moveX.value =
        (wrapRef.value.scrollLeft / offsetWrapWidth.value) * ratioX.value
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
      moveX,
      ratioY,
      ratioX,
      height,
      width,
      sizeHeight,
      sizeWidth,
    }
  },
})
</script>
