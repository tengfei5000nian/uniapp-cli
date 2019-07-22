<template>
  <div v-if="false"></div>
</template>

<script>
  import { adErrorInfo, sendEvent } from './ad'

  const createAd = wx.createInterstitialAd
  const selfData = {
    ad: null,
    errCode: '0',
    showLogTime: 0
  }

  export default {
    name: 'meInterstitialAd',
    props: {
      unitId: {
        type: String,
        default: ''
      },
      direction: {
        type: Number,
        default: 30 * 60 * 1000
      },
      logOnly: {
        type: Boolean,
        default: true
      },
      selfShow: {
        type: Boolean,
        default: true
      }
    },
    onLoad() {
      const unitId = this.unitId
      if (unitId && createAd) {
        const ad = createAd({
          adUnitId: unitId
        })
        ad.onError(this.error)
        selfData.ad = ad
      }
    },
    onShow() {
      this.selfShow && this.show()
    },
    methods: {
      error(err) {
        selfData.errCode = err.errCode
      },
      has() {
        return new Promise((resolve, reject) => {
          if (!selfData.ad) {
            reject({
              message: adErrorInfo[selfData.errCode]
            })
          } else if ((this.logOnly ? (wx.getStorageSync('meInterstitialAdShowLog') || 0) : selfData.showLogTime) + this.direction > new Date().getTime()) {
            reject({
              message: '广告播放间隔未达到'
            })
          } else {
            resolve()
          }
        })
      },
      show() {
        return new Promise((resolve, reject) => {
          this.has().then(() => {
            return selfData.ad.show()
          }).then(() => {
            if (this.logOnly) {
              wx.setStorage({
                key: 'meInterstitialAdShowLog',
                data: new Date().getTime()
              })
            } else {
              selfData.showLogTime = new Date().getTime()
            }
            resolve()
          }).catch((err = {}) => {
            const error = {
              message: err.message || '插屏广告显示失败'
            }
            sendEvent({
              adType: '插屏广告错误',
              unitId: this.unitId,
              errCode: selfData.errCode,
              message: error.message
            })
            reject(error)
          })
        })
      }
    }
  }
</script>

<style lang="scss"></style>
