<template>
  <view>
    <button v-if="isDefaultSlot" :class="className" @click="show">
      <slot></slot>
    </button>
    <canvas canvas-id="shareCover" class="share-cover" style="width:750px;height:1049px;"></canvas>
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
          Promise.all([
            this.image('https://cdn.feesource.xyz/bgzb/gkdj/notice.png'),
            this.image(code)
          ]).then(([bg, code]) => {
            const { certificate, school } = this.options
            const width = 750
            const heigth = 1049
            const canvasId = 'shareCover'
            const context = uni.createCanvasContext(canvasId, this)

            context.drawImage(bg, 0, 0, width, heigth)
            context.drawImage(code, 298, 68, 154, 152)

            context.save()
            context.font = '54px SourceHanSerifCN'
            context.setFontSize(54)
            context.setFillStyle('#b39845')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText(school.school[0], 375, 275)
            context.restore()

            context.save()
            context.font = '24px SourceHanSerifCN'
            context.setFontSize(24)
            context.setFillStyle('#b39845')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText(school.school[1], 375, 350)
            context.restore()

            context.save()
            context.setFontSize(30)
            context.setFillStyle('#333')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText(certificate.name, 182, 490)
            context.restore()

            !function() {
              const fontSize = 28
              const maxWidth = 440
              const lineFontSum = Math.floor(maxWidth / fontSize)
              const lineSum = Math.ceil(school.quotation.length / lineFontSum)
              const lineHeight = fontSize * 1.2
              context.save()
              context.setFontSize(fontSize)
              context.setFillStyle('#333')
              context.setTextAlign('left')
              context.setTextBaseline('top')
              for (let i = 0; i < lineSum; i++) {
                context.fillText(school.quotation.slice(0 + i * lineFontSum, 0 + (i + 1) * lineFontSum), 200, 818 + i * lineHeight, maxWidth)
              }
              context.restore()
            }()
            
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
