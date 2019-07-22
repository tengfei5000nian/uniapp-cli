<template>
  <block v-if="miniappConfig.show !== false">
    <navigator
      v-if="item.appid"
      :class="classArr"
      :style="{ 'top': uni.upx2px(miniappConfig.top) + 'px' }"
      class="me-side-icon-ad btn-side fixed" 
      target="miniProgram"
      :app-id="item.appid"
      :path="item.path"
      @fail="showCode(item.code)"
      @animationiteration="change"
    >
      <img class="logo" :src="item.logo">
      <div v-if="footer" class="title">{{ footer }}</div>
    </navigator>
    <div
      v-else-if="item.code"
      :class="classArr"
      :style="{ 'top': uni.upx2px(miniappConfig.top) + 'px' }"
      class="me-side-icon-ad btn-side fixed"
      @click="showCode(item.code)"
      @animationiteration="change"
    >
      <img class="logo" :src="item.logo">
      <div v-if="footer" class="title">{{ footer }}</div>
    </div>
  </block>
</template>

<script>
  import 'animate.css/source/attention_seekers/swing.css'
  import 'animate.css/source/attention_seekers/pulse.css'

  import { showCode } from './ad'

  const selfData = {
    list: []
  }

  export default {
    name: 'meSideIconAd',
    props: {
      className: {
        type: [String, Array],
        default: ''
      },
      type: {
        type: String,
        default: 'circle'
      }
    },
    data() {
      return {
        item: {},
        footer: '',
        animate: ''
      }
    },
    computed: {
      miniappConfig() {
        const config = this.$store.state.config.miniappConfig || {}
        const type = this.type
        const seat = (config[type] || {}).seat
        return {
          seat: ['left', 'right'].includes(seat) ? seat : 'left',
          top: (config[type] || {}).top || 0,
          show: (config[type] || {}).show
        }
      },
      classArr() {
        return [this.type, this.miniappConfig.seat, this.animate].concat(this.className)
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      showCode,
      init() {
        const miniappConfig = this.$store.state.config.miniappConfig || {}
        const miniapp = miniappConfig.miniapp || []
        const ad = miniappConfig[this.type] || {}
        selfData.list = Array.isArray(ad.data) && ad.data.length ? miniapp.filter((row, index) => ad.data.includes(index)) : miniapp
        this.footer = ad.footer || ''
        this.change()
      },
      change() {
        this.item = selfData.list[Math.floor(Math.random() * selfData.list.length)] || {}
        this.animate = ''
        this.$nextTick(() => {
          this.animate = 'animate'
        })
      }
    }
  }
</script>

<style lang="scss">
  .me-side-icon-ad{
    position: fixed;
    .logo{
      display: block;
    }
    .title{
      $textShadow: 0 0 2px #8d5937;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 1.2em;
      font-size: 20upx;
      color: #fff;
      text-shadow: $textShadow, $textShadow, $textShadow, $textShadow, $textShadow,
                   $textShadow, $textShadow, $textShadow, $textShadow, $textShadow,
                   $textShadow, $textShadow, $textShadow, $textShadow, $textShadow,
                   $textShadow, $textShadow, $textShadow, $textShadow, $textShadow;
    }
    &.circle{
      &.animate{
        animation: swing 1s 2s infinite;
      }
      .logo{
        width: 92upx;
        height: 92upx;
        border-radius: 50%;
        border: 6upx solid #e6c17f;
        background-color: #f5e7c4;
        box-shadow: 0 4upx 8upx 0 rgba(#68453a, .51);
      }
      .title{
        position: absolute;
        bottom: -6upx;
        left: 0;
        right: 0;
      }
    }
    &.square{
      border-radius: 18upx;
      border: 6upx solid #e6c17f;
      padding: 6upx 6upx 0;
      background-color: #f5e7c4;
      box-shadow: 0 4upx 8upx 0 rgba(#68453a, .51);
      &.animate{
        animation: pulse 1s 3s infinite;
      }
      .logo{
        width: 102upx;
        height: 102upx;
        border-radius: 10upx;
        background-color: #d0a67b;
      }
      .title{
        height: 35upx;
      }
    }
  }
</style>
