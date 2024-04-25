<script lang="ts">
import HelloVue from '../../../components/hello-vue/src'
import { defineComponent } from 'vue-demi'

export default defineComponent({
  components: {
    HelloVue,
  },
})
</script>

<template>
  <div class="play-container">
    <HelloVue />
  </div>
</template>

<style lang="less">
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;

  #play {
    height: 100%;
    width: 100%;

    .play-container {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
