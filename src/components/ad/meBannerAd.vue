<template>
  <div v-if="unitId" v-show="!adError" :class="className" class="me-banner-ad">
    <div>
      <div>
        <ad :unit-id="unitId" @load="load" @error="error"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { sendEvent } from './ad'

  export default {
    name: 'meBannerAd',
    props: {
      unitId: {
        type: String,
        default: ''
      },
      className: {
        type: [String, Array],
        default: ''
      }
    },
    data() {
      return {
        adError: false
      }
    },
    methods: {
      load(e) {
        this.adError = false
      },
      error(e) {
        this.adError = true
        sendEvent({
          adType: '横幅广告错误',
          unitId: this.unitId,
          errCode: e.mp && e.mp.detail && e.mp.detail.errCode,
          message: '横幅广告加载失败'
        })
      }
    }
  }
</script>

<style lang="scss">
  .me-banner-ad{
    box-sizing: border-box;
    >div{
      position: relative;
      height: 0;
      padding-top: 34%;
      overflow: hidden;
      >div{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
