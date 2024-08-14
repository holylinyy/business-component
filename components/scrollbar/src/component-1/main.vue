<template>
  <div class="relative overflow-hidden select-none">
    <div
      ref="wrapRef"
      class="scrollbar-none overflow-scroll h-full"
      @scroll="onScroll"
    >
      <div ref="viewRef" class="w-max">
        <slot />
      </div>
    </div>
    <bar direction="horizontal" :move="moveX" :size="sizeWidth" />
    <bar direction="vertical" :move="moveY" :size="sizeHeight" />
  </div>
</template>

<script lang="ts">
import { addResizeListener, removeResizeListener } from './utils'
import Bar from './bar.vue'
import { defineComponent } from 'vue-demi'
export default defineComponent({
  components: {
    Bar,
  },

  data() {
    return {
      widthPercentage: 0,
      heightPercentage: 0,
      moveX: 0,
      moveY: 0,
      currentHeight: 0,
    }
  },

  computed: {
    wrap() {
      return this.$refs.wrapRef
    },

    sizeWidth() {
      return this.widthPercentage < 100 ? this.widthPercentage + '%' : '0'
    },

    sizeHeight() {
      return this.heightPercentage < 100 ? this.heightPercentage + '%' : '0'
    },
  },

  mounted() {
    addResizeListener(this.$refs.wrapRef, this.update)
    addResizeListener(this.$refs.viewRef, this.update)
  },

  beforeUnmount() {
    removeResizeListener(this.$refs.wrapRef, this.update)
    removeResizeListener(this.$refs.viewRef, this.update)
  },

  methods: {
    onScroll(e) {
      this.updateThumbMove()
      this.$emit('scroll', e)
    },

    updateThumbMove() {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = this.wrap

      this.moveY =
        (scrollTop / (scrollHeight - clientHeight)) *
        (100 / this.heightPercentage - 1) *
        100
      this.moveX =
        (scrollLeft / (scrollWidth - clientWidth)) *
        (100 / this.widthPercentage - 1) *
        100
    },

    update() {
      const wrap = this.wrap

      if (!wrap) return

      const { clientWidth, scrollWidth, clientHeight, scrollHeight } = wrap

      let widthPercentage = (clientWidth * 100) / scrollWidth
      let heightPercentage = (clientHeight * 100) / scrollHeight

      let MIN_THUMB_SIZE = 20

      if ((widthPercentage * clientWidth) / 100 < MIN_THUMB_SIZE) {
        widthPercentage = (MIN_THUMB_SIZE / clientWidth) * 100
      }
      if ((heightPercentage * clientHeight) / 100 < MIN_THUMB_SIZE) {
        heightPercentage = (MIN_THUMB_SIZE / clientHeight) * 100
      }

      this.widthPercentage = widthPercentage
      this.heightPercentage = heightPercentage

      this.updateThumbMove()
    },

    setScrollOffset({ offsetX, offsetY }) {
      offsetX && (this.$refs.wrapRef.scrollLeft = offsetX)
      offsetY && (this.$refs.wrapRef.scrollTop = offsetY)

      this.update()
    },
  },
})
</script>
