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
          const { code, num, xx, remark, family, user } = this.options
          Promise.all([
            this.image('https://cdn.feesource.xyz/bgzb/nkdm/answer_bg.png'),
            this.image('https://cdn.feesource.xyz/bgzb/nkdm/kdzs.png'),
            this.image('https://cdn.feesource.xyz/bgzb/nkdm/xx_selected.png'),
            this.image('https://cdn.feesource.xyz/bgzb/nkdm/xx.png'),
            this.image('https://cdn.feesource.xyz/bgzb/nkdm/remark.png'),
            this.image(user.logo),
            this.image('https://cdn.feesource.xyz/bgzb/nkdm/share.png'),
            this.image(code),
            this.image('https://cdn.feesource.xyz/bgzb/nkdm/btn_fx.png'),
          ]).then(([bg, kdzs, xs, x, remarkCover, logo, share, codeLocal, btn]) => {
            const width = 750
            const heigth = 1200
            const canvasId = 'shareCover'
            const context = uni.createCanvasContext(canvasId, this)

            context.save()
            context.setFillStyle('#fbde62')
            context.fillRect(0, 0, width, heigth)
            context.restore()

            context.save()
            context.fillStyle = context.createPattern(bg, 'repeat')
            context.fillRect(0, 0, width, heigth)
            context.restore()

            context.drawImage(kdzs, 99, 60, 551, 170)

            !function() {
              const top = 162
              const left = 216
              const step = 72
              for (let s = 0; s < xx[0]; s++) {
                context.drawImage(xs, left + s * step, top, 36, 36)
              }
              for (let i = 0; i < xx[1]; i++) {
                context.drawImage(x, left + (xx[0] + i) * step, top, 36, 36)
              }
            }()

            context.drawImage(remarkCover, 149, 261, 558, 715)

            !function() {
              const top = 294
              const left = 236
              const fontSize = 24
              const maxWidth = 435
              const lineFontSum = Math.ceil(maxWidth / fontSize)
              const lineSum = Math.ceil(remark.length / lineFontSum)
              const lineHeight = fontSize * 1.5
              context.save()
              context.setFontSize(fontSize)
              context.setFillStyle('#490b0d')
              context.setTextAlign('left')
              context.setTextBaseline('top')
              for (let i = 0; i < lineSum; i++) {
                context.fillText(remark.slice(0 + i * lineFontSum, 0 + (i + 1) * lineFontSum), left, top + i * lineHeight, maxWidth)
              }
              context.restore()
            }()

            context.save()
            context.beginPath()
            context.arc(103, 325, 50, 0, 2 * Math.PI)
            context.closePath()
            context.setFillStyle('#502a20')
            context.fill()
            context.clip()
            context.drawImage(logo, 53, 275, 100, 100)
            context.restore()

            !function() {
              const fontSize = 30
              const maxWidth = 200
              const lineFontSum = Math.floor(maxWidth / fontSize)
              context.save()
              context.font = `normal normal ${fontSize}px/1 ${family || 'sans-serif'}`
              context.setFillStyle('#490b0d')
              context.setTextAlign('center')
              context.setTextBaseline('top')
              context.fillText(lineFontSum >= user.name.length ? user.name : user.name.slice(0, lineFontSum) + '…', 103, 393, maxWidth)
              context.restore()
            }()

            context.save()
            context.font = 'normal bold 89px/1 HYXiaoMaiTiJ'
            context.setFillStyle('#f1180f')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText(num + '%', 103, 430)
            context.restore()

            context.drawImage(share, 55, 994, 640, 156)
            context.drawImage(codeLocal, 550, 1005, 150, 150)
            context.drawImage(btn, 55, 1103, 200, 60)

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
