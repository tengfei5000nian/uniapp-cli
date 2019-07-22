<template>
  <view>
    <button v-if="isDefaultSlot" :class="className" @click="show">
      <slot></slot>
    </button>
    <canvas canvas-id="shareCover" class="share-cover" style="width:750px;height:1260px;"></canvas>
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
          const { certificate, zhonhe } = this.options
          Promise.all([
            this.image('https://cdn.feesource.xyz/bgzb/gkdj/zkz.png'),
            this.image(code),
            this.image(certificate.logo)
          ]).then(([bg, code, logo]) => {
            const width = 750
            const heigth = 1260
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
              const h = 900
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

            context.drawImage(bg, 6, 30, 738, 820)

            context.save()
            context.setFontSize(26)
            context.setFillStyle('#333')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText(certificate.title, 375, 60)
            context.restore()

            !function() {
              const x = 75
              const y = 195
              const w = 211
              const h = 211
              const r = 10
              context.save()
              context.setFillStyle('#eee')
              context.beginPath()

              context.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

              context.moveTo(x + r, y)
              context.lineTo(x + w - r, y)
              context.lineTo(x + w, y + r)

              context.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
   
              context.lineTo(x + w, y + h - r)
              context.lineTo(x + w - r, y + h)

              context.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

              context.lineTo(x + r, y + h)
              context.lineTo(x, y + h - r)

              context.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

              context.lineTo(x, y + r)
              context.lineTo(x + r, y)

              context.fill()

              context.closePath()
              context.clip()
              context.drawImage(logo, x, y, w, h)
              context.restore()
            }()

            context.save()
            context.setFontSize(28)
            context.setFillStyle('#666')
            context.setTextAlign('left')
            context.setTextBaseline('top')
            context.fillText(certificate.id, 470, 207)
            context.fillText(certificate.name, 415, 257)
            context.fillText(certificate.sex, 415, 307)
            context.fillText(certificate.age, 415, 357)
            context.restore()

            context.save()
            context.setFontSize(26)
            context.setFillStyle('#999')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText('月 日', 126, 631)
            context.fillText('9:30-11:30', 345, 631)
            context.fillText('15:00-17:00', 596, 631)
            context.fillText('6月7日', 126, 711)
            context.fillText('语文', 345, 711)
            context.fillText('数学', 596, 711)
            context.fillText('6月8日', 126, 791)
            context.fillText(zhonhe, 345, 791)
            context.fillText('外语', 596, 791)
            context.restore()

            context.drawImage(code, 265, 940, 220, 220)

            context.save()
            context.setFontSize(28)
            context.setFillStyle('#999')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText('永远18岁工作室', 375, 1190)
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
