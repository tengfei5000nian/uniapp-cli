<template>
  <canvas
    v-if="options.disableTouch"
    :id="canvasId"
    :canvas-id="canvasId"
    :class="className"
    class="e-charts"
  />
  <canvas
    v-else
    :id="canvasId"
    :canvas-id="canvasId"
    :class="className"
    class="e-charts"
    @touchstart="touchStart($event.mp)"
    @touchmove="touchMove($event.mp)"
    @touchend="touchEnd($event.mp)"
  />
</template>

<script>
  import WxCanvas from './wx-canvas'
  import { init, setCanvasCreator } from 'echarts'

  export default {
    props: {
      className: {
        type: [String, Array],
        default: ''
      },
      canvasId: {
        type: String,
        default: 'eCharts'
      },
      options: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    logic() {
      return {
        chart: null,
        isMounted: false,
        isInit: false
      }
    },
    watch: {
      options: {
        handler(val) {
          this.$Logic.chart ? this.setOption() : this.init()
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {
      this.$Logic.isMounted = true
      if (this.$Logic.isInit) {
        this.$Logic.isInit = false
        this.init()
      }
    },
    methods: {
      init() {
        if (!this.$Logic.isMounted) return this.$Logic.isInit = true
        const ctx = uni.createCanvasContext(this.canvasId, this)
        const canvas = new WxCanvas(ctx, this.canvasId)
        setCanvasCreator(() => canvas)
        uni.createSelectorQuery().in(this).select(`#${this.canvasId}`).boundingClientRect(res => {
          const chart = init(canvas, null, {
            width: res.width,
            height: res.height
          })
          canvas.setChart(chart)
          this.$Logic.chart = chart
          this.setOption()
        }).exec()
      },
      setOption() {
        const chart = this.$Logic.chart
        if (!(chart && chart.setOption)) return
        chart.setOption(this.options)
      },
      touchStart(e) {
        const chart = this.$Logic.chart
        if (chart && e.touches.length > 0) {
          var touch = e.touches[0]
          chart._zr.handler.dispatch('mousedown', {
            zrX: touch.x,
            zrY: touch.y
          })
          chart._zr.handler.dispatch('mousemove', {
            zrX: touch.x,
            zrY: touch.y
          })
        }
      },
      touchMove(e) {
        const chart = this.$Logic.chart
        if (chart && e.touches.length > 0) {
          var touch = e.touches[0]
          chart._zr.handler.dispatch('mousemove', {
            zrX: touch.x,
            zrY: touch.y
          })
        }
      },
      touchEnd(e) {
        const chart = this.$Logic.chart
        if (chart) {
          const touch = e.changedTouches ? e.changedTouches[0] : {}
          chart._zr.handler.dispatch('mouseup', {
            zrX: touch.x,
            zrY: touch.y
          })
          chart._zr.handler.dispatch('click', {
            zrX: touch.x,
            zrY: touch.y
          })
        }
      }
    }
  }
</script>
