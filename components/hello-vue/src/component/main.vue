<template>
  <div class="text-red">{{ msg }}</div>
</template>

<script lang="ts">
import { defineComponent, version, computed } from 'vue-demi'

export default defineComponent({
  setup() {
    const msg = computed(() => {
      return `hello666 vue ${version}`
    })
    return {
      msg,
    }
  },
})
</script>

<style scoped lang="less"></style>
