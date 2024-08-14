<template>
  <div
    class="absolute top-1 bottom-1 right-1 w-1 bg-#18222c rounded-1 cursor-pointer"
    :style="style"
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
import { BAR_MAP, DIRECTION } from './constants'

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
  },
  setup(props) {
    const bar = computed(() => {
      return props.vertical ? DIRECTION.VERTICAL : DIRECTION.HORIZONTAL
    })
    const style = computed(() => {
      return {
        height: props.size + 'px',
        transform: `translate${BAR_MAP[bar.value].axis}(${props.move * 100}%)`,
      }
    })
    return {
      style,
    }
  },
})
</script>
