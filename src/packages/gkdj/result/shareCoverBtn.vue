<template>
  <view>
    <button v-if="isDefaultSlot" :class="className" @click="show">
      <slot></slot>
    </button>
    <canvas canvas-id="shareCover" class="share-cover" style="width:750px;height:1294px;"></canvas>
  </view>
</template>

<script>
  import { code } from '../main'
  import { showImg } from '@/common'
  import { canvas } from '@/common/vue.expand'

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
          const { certificate } = this.options
          Promise.all([
            new Promise((resolve, reject) => {
              uni.canvasToTempFilePath({
                canvasId: 'eCharts',
                fileType: 'png',
                quality: 1,
                complete: res => {
                  /ok/.test(res.errMsg) ? resolve(res.tempFilePath) : reject({
                    message: '雷达图导出失败'
                  })
                }
              }, this.$root.$refs.eCharts)
            }),
            this.image(code),
            this.image(certificate.logo)
          ]).then(([eCharts, code, logo]) => {
            const width = 750
            const heigth = 1294
            const canvasId = 'shareCover'
            const context = uni.createCanvasContext(canvasId, this)

            context.save()
            context.setFillStyle('#f5f5f5')
            context.fillRect(0, 0, width, heigth)
            context.restore()

            !function() {
              const x = 0
              const y = 0
              const w = width
              const h = 933
              const r = 40
              context.save()
              context.setFillStyle('#fff')
              context.beginPath()

              context.moveTo(x, y)
              context.lineTo(x + w, y)

              context.lineTo(x + w, y + h - r)
              context.lineTo(x + w - r, y + h)

              context.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

              context.lineTo(x + r, y + h)
              context.lineTo(x, y + h - r)

              context.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

              context.lineTo(x, y + r)
              context.lineTo(x, y)

              context.fill()

              context.closePath()
              context.clip()
              context.restore()
            }()

            context.save()
            context.setFontSize(36)
            context.setFillStyle('#2b2e2d')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText('高考成绩单', 375, 25)
            context.restore()

            context.save()
            context.beginPath()
            context.arc(375, 240, 90, 0, 2 * Math.PI)
            context.closePath()
            context.setFillStyle('#eee')
            context.fill()
            context.clip()
            context.drawImage(logo, 285, 150, 180, 180)
            context.restore()

            context.save()
            context.setFontSize(40)
            context.setFillStyle('#333')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText(certificate.name, 375, 350)
            context.restore()

            context.drawImage(eCharts, 0, 450, width, 500)

            context.drawImage(code, 265, 970, 220, 220)

            context.save()
            context.setFontSize(28)
            context.setFillStyle('#999')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText('永远18岁工作室', 375, 1220)
            context.restore()

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
      show() {
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
