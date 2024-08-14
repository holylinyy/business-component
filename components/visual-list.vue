<template>
  <div
    ref="viewRef"
    class="viewport"
    :style="{ height }"
    @scroll="handleScroll"
  >
    <div
      :style="{
        transform: `translateY(${offset}px) `,
      }"
      class="scroll-list"
    >
      <div
        v-for="item in renderList"
        ref="vItem"
        :key="item.vkey"
        :vid="item.index"
      >
        <slot :child="item.data"></slot>
      </div>
    </div>
    <div ref="scrollbarRef" class="scroll-bar"></div>
  </div>
</template>

<script>
// import { Scrollbar } from 'element-ui'
// import 'element-ui/lib/theme-chalk/scrollbar.css'
import debounce from 'lodash/debounce'

export default {
  name: 'KucVisualList',
  components: {
    // Scrollbar
  },
  props: {
    onScroll: {
      type: Function,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
    distance: {
      type: Number,
      default() {
        return 20
      },
    },
    onLoad: {
      type: Function,
      default: () => {},
    },
    canLoad: {
      type: Boolean,
      default: true,
    },
    height: {
      type: [String, Number],
      default: 0,
    },
    forceKey: {
      type: Boolean,
      default: false,
    },
    getNodeKey: {
      type: Function,
      require: true,
    },
    variable: {
      type: Boolean,
      default() {
        return false
      },
    },
    remain: {
      type: Number,
      default() {
        return 20
      },
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
    size: {
      type: Number,
      default() {
        return 46
      },
    },
  },
  data() {
    return {
      start: 0,
      offset: 0,
      end: 20, // props.remain
      posList: [],
    }
  },
  computed: {
    cache() {
      return this.remain
    },
    viewHeight() {
      return this.height
    },
    allList() {
      return this.list.map((e, index) => ({
        data: e,
        vkey: this.forceKey
          ? index
          : this.getNodeKey(e)
            ? this.getNodeKey(e)
            : index,
        index,
        // vkey: Math.random()
      }))
    },
    renderList() {
      let start = this.start - this.preCount
      let end = this.end + this.nextCount
      return this.allList.slice(start, end)
    },
    preCount() {
      return Math.min(this.cache, this.start)
    },
    nextCount() {
      return Math.min(this.cache, this.list.length - this.end)
    },
  },
  watch: {
    'list.length'() {
      this.updateScrollbarHeight()
      this.cacheList()
    },
  },
  created() {
    this.end = Math.min(this.start + this.remain, this.list.length)
  },
  mounted() {
    this.updateScrollbarHeight()
    this.cacheList()
  },
  beforeUpdate() {},
  updated() {
    if (this.variable && this.$refs.vItem && this.$refs.vItem.length) {
      this.$refs.vItem.forEach((node) => {
        let { height } = node.getBoundingClientRect()
        let idx = Number(node.getAttribute('vid'))
        let oldHeight = this.posList[idx].height
        let val = oldHeight - height
        if (val) {
          this.posList[idx].bottom = this.posList[idx].bottom - val
          this.posList[idx].height = height
          for (let i = idx + 1; i < this.posList.length; i++) {
            this.posList[i].bottom = this.posList[i].bottom - val
            this.posList[i].top = this.posList[i - 1].bottom
          }
        }
      })
      this.$refs.scrollbarRef.style.height =
        this.posList[this.posList.length - 1].bottom + 'px'
    }
  },
  methods: {
    cacheList() {
      this.posList = this.list.map((item, index) => ({
        top: index * this.size,
        bottom: (index + 1) * this.size,
        height: this.size,
      }))
    },
    updateScrollbarHeight() {
      if (this.$refs.scrollbarRef && this.$refs.viewRef) {
        this.$refs.scrollbarRef.style.height =
          this.list.length * this.size + 'px'
      }
    },
    getStartIndex(value) {
      let start = 0
      let end = this.posList.length - 1
      let temp = this.posList.length - 1
      while (start <= end) {
        let mid = Math.floor((start + end) / 2)
        let midValue = this.posList[mid].bottom
        if (midValue === value) {
          return mid + 1
        } else if (midValue < value) {
          start = mid + 1
        } else {
          if (temp === null || temp > mid) {
            temp = mid
          }
          end = mid - 1
        }
      }
      return temp
    },
    calcOffset() {
      const scrollTop = this.$refs.viewRef.scrollTop
      if (this.variable) {
        this.start = this.getStartIndex(scrollTop)
        this.end = this.start + this.remain
        this.offset = this.posList[this.start - this.preCount]
          ? this.posList[this.start - this.preCount].top
          : 0
      } else {
        this.start = Math.floor(scrollTop / this.size)
        this.offset = this.start * this.size - this.preCount * this.size
        this.end = Math.min(this.start + this.remain, this.list.length)
      }
    },
    async calcLoadMore() {
      if (!this.onLoad || !this.canLoad || this.loading) return
      const { scrollTop, scrollHeight, clientHeight } = this.$refs.viewRef
      if (scrollHeight - scrollTop - clientHeight > this.distance) return
      await Promise.resolve(this.onLoad())
    },
    handleScroll: debounce(function () {
      this.onScroll()
      // 计算偏移量
      this.calcOffset()
      // 计算是否要触发加载更多
      this.calcLoadMore()
    }, 50),
  },
}
</script>

<style lang="less">
.viewport {
  overflow: auto;
  position: relative;

  .scroll-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
