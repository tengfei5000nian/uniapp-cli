<template>
  <div v-if="false"></div>
</template>

<script>
  import { adErrorInfo, sendEvent } from './ad'

  const createAd = wx.createRewardedVideoAd
  const selfData = {
    errCode: '0',
    promise: {
      resolve: null,
      reject: null
    }
  }

  export default {
    name: 'meVideoAd',
    props: {
      unitId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        ad: null
      }
    },
    onLoad() {
      const unitId = this.unitId
      if (unitId && createAd) {
        const ad = createAd({
          adUnitId: unitId
        })
        ad.onError(err => {})
        ad.onClose(this.close)
        this.ad = ad
      }
    },
    methods: {
      has() {
        return new Promise((resolve, reject) => {
          const ad = this.ad
          if (ad) {
            ad.load().then(() => {
              resolve()
            }).catch(err => {
              if (err.errCode) selfData.errCode = err.errCode
              reject({
                message: adErrorInfo[selfData.errCode] || '暂无可播放视频广告'
              })
            })
          } else {
            reject({
              message: adErrorInfo[selfData.errCode]
            })
          }
        })
      },
      play(resolve, reject) {
        return this.ad.show().then(() => {
          selfData.promise = {
            resolve,
            reject
          }
        })
      },
      show() {
        return new Promise((resolve, reject) => {
          this.play(resolve, reject).catch(err => {
            this.has().then(() => {
              return this.play(resolve, reject)
            }).catch(err => {
              const error = {
                message: err && err.message || '视频广告播放失败'
              }
              sendEvent({
                adType: '视频广告错误',
                unitId: this.unitId,
                errCode: selfData.errCode,
                message: error.message
              })
              reject(error)
            })
          })
        })
      },
      close(res) {
        const { resolve, reject } = selfData.promise
        if (res && res.isEnded || res === undefined) {
          resolve()
        } else {
          reject({
            message: '视频广告未看完'
          })
        }
      }
    }
  }
</script>

<style lang="scss"></style>
