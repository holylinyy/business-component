<template>
  <div
    class="absolute right-2px bottom-2px z-1 rounded-4px select-none"
    :class="barClassNames"
    @mousedown="clickBarHandler"
  >
    <div
      ref="thumb"
      class="relative block w-0 cursor-pointer rounded-4px bg-#38bdf8"
      :class="thumbClassNames"
      :style="thumbStyle"
      @mousedown="clickThumbHandler"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { BAR_MAP, DIRECTION } from './constants'

export default defineComponent({
  name: 'KucScrollbarBar',

  props: {
    direction: {
      type: String,
      default: DIRECTION.VERTICAL,
      validator(value: string) {
        return Object.values(DIRECTION).includes(value)
      },
    },
    size: {
      type: String,
      require: true,
    },
    move: {
      type: Number,
      require: true,
    },
  },

  computed: {
    bar() {
      return BAR_MAP[this.direction]
    },

    wrap() {
      return (this.$parent as any).wrap
    },

    barClassNames() {
      const classNames = []

      if (this.direction === DIRECTION.VERTICAL) {
        classNames.push('w-6px', 'top-2px')
      } else if (this.direction === DIRECTION.HORIZONTAL) {
        classNames.push('h-6px', 'left-2px')
      }

      return classNames
    },

    thumbClassNames() {
      const classNames = []

      if (this.direction === DIRECTION.VERTICAL) {
        classNames.push('w-full')
      } else if (this.direction === DIRECTION.HORIZONTAL) {
        classNames.push('h-full')
      }

      return classNames
    },

    thumbStyle() {
      const { size, axis } = this.bar

      return {
        [size]: this.size,
        transform: `translate${axis}(${this.move}%)`,
      }
    },
  },

  unmounted() {
    document.removeEventListener('mouseup', this.mouseUpDocumentHandler)
  },

  methods: {
    startDrag(e) {
      e.stopImmediatePropagation()
      this.cursorDown = true

      document.addEventListener('mousemove', this.mouseMoveDocumentHandler)
      document.addEventListener('mouseup', this.mouseUpDocumentHandler)
      document.onselectstart = () => false
    },

    clickBarHandler(e) {
      const { scroll, direction, client, offset, scrollSize } = this.bar
      const scrollOffset = Math.abs(
        e.target.getBoundingClientRect()[direction] - e[client],
      )
      const thumbPositionPercentage = (scrollOffset * 100) / this.$el[offset]

      this.wrap[scroll] =
        (thumbPositionPercentage * this.wrap[scrollSize]) / 100
    },

    clickThumbHandler(e) {
      if (e.ctrlKey || e.button === 2) return

      const { axis, offset, direction, client } = this.bar

      this.startDrag(e)
      this[axis] =
        e.currentTarget[offset] -
        (e[client] - e.currentTarget.getBoundingClientRect()[direction])
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return

      const { axis, scroll, direction, client, offset, scrollSize } = this.bar
      const prevPage = this[axis]

      if (!prevPage) return

      const scrollOffset =
        (this.$el.getBoundingClientRect()[direction] - e[client]) * -1
      const thumbClickPosition = this.$refs.thumb[offset] - prevPage
      const thumbPositionPercentage =
        ((scrollOffset - thumbClickPosition) * 100) / this.$el[offset]

      this.wrap[scroll] =
        (thumbPositionPercentage * this.wrap[scrollSize]) / 100
    },

    mouseUpDocumentHandler() {
      this.cursorDown = false
      this[this.bar.axis] = 0

      document.removeEventListener('mousemove', this.mouseMoveDocumentHandler)
      document.onselectstart = null
    },
  },
})
</script>
