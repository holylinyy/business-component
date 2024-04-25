<template>
  <div>{{ msg }}</div>
</template>

<script lang="ts">
import { defineComponent, version, computed } from 'vue-demi'

export default defineComponent({
  setup() {
    const msg = computed(() => {
      return `hello111 vue ${version}`
    })
    return {
      msg,
    }
  },
})
</script>

<style scoped lang="less"></style>
