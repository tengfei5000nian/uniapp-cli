<template>
  <view>
    <button v-if="isDefaultSlot" :class="className" @click="show">
      <slot></slot>
    </button>
    <canvas canvas-id="shareCover" class="share-cover" style="width:750px;height:1200px;"></canvas>
  </view>
</template>

<script>
  import { showImg } from '@/common'
  import { canvas } from '@/common/vue.expand'
  
  let selfData = {}
  
  export default {
    mixins: [canvas],
    props: {
      className: {
        type: [String, Array],
        default: ''
      },
      options: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      isDefaultSlot() {
        const slots = this.$slots || {}
        return Array.isArray(slots.default) ? slots.default.length : slots.default
      }
    },
    methods: {
      create() {
        return new Promise((resolve, reject) => {
          const user = this.$store.state.user
          Promise.all([
            this.image(selfData.coverAll),
            this.image(user.logo),
            this.image(selfData.code)
          ]).then(([coverAll, logo, code]) => {
            const width = 750
            const heigth = 1200
            const canvasId = 'shareCover'
            const context = uni.createCanvasContext(canvasId, this)

            context.drawImage(coverAll, 0, 0, 750, 1200)
            
            context.save()
            context.beginPath()
            context.arc(83, 75, 33, 0, 2 * Math.PI)
            context.closePath()
            context.setFillStyle('#fff')
            context.fill()
            context.clip()
            context.drawImage(logo, 50, 42, 66, 66)
            context.restore()
            
            context.save()
            context.setFontSize(36)
            context.setFillStyle('#fff')
            context.setTextAlign('left')
            context.setTextBaseline('top')
            context.fillText(user.name, 135, 60)
            context.restore()
            
            this.box(context, {
                left: 610,
                top: 30,
                width: 90,
                height: 90,
                color: '#fff'
            })
            context.drawImage(code, 610, 30, 90, 90)

            context.draw(false, () => {
              uni.canvasToTempFilePath({
                canvasId: canvasId,
                x: 0,
                y: 0,
                width: width,
                height: heigth,
                destWidth: width,
                destHeight: heigth,
                fileType: 'jpg',
                quality: 1,
                complete: res => {
                  /ok/.test(res.errMsg) ? resolve(res.tempFilePath) : reject({
                    message: '分享图导出失败'
                  })
                }
              }, this)
            })
          }).catch(reject)
        })
      },
      get() {
        return new Promise((resolve, reject) => {
          this.create().then(src => {
            uni.saveFile({
              tempFilePath: src,
              complete: res => {
                src = /ok/.test(res.errMsg) ? res.savedFilePath : src
                resolve(src)
              }
            })
          }).catch(err => {
            reject(err)
          })
        })
      },
      show(data) {
        selfData = data
        this.$Loading.show('分享图生成中')
        this.get().then(src => {
          uni.saveImageToPhotosAlbum({
            filePath: src,
            complete: res => {
              this.$Toast.show({
                title: /ok/.test(res.errMsg) ? '分享图保存成功' : '分享图保存失败',
                closeSend: true
              }).then(() => {
                showImg(src)
              })
            }
          })
        }).catch(err => {
          this.$Toast.show(err && err.message || '分享图生成失败')
        }).finally(() => {
          this.$Loading.hide()
        })
      }
    }
  }
</script>

<style lang="scss">
  .share-cover{
    position: fixed;
    top: 100%;
    left: 100%;
    z-index: 999;
    pointer-events: none;
  }
</style>
