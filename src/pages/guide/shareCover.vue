<template>
    <canvas :canvas-id="canvasId" :style="[canvasStyle]" class="share-cover"></canvas>
</template>

<script>
    import { showImg } from '@/common'
    import { canvas } from '@/common/vue.expand'
    
    let selfData = {}
  
    export default {
        mixins: [canvas],
        data() {
            return {
                width: 600,
                height: 1010,
                canvasId: 'shareCover'
            }
        },
        methods: {
            create() {
                return new Promise((resolve, reject) => {
                    Promise.all([
                        this.image('https://cdn.feesource.xyz/mxzb/assets/share_cover_bg.png'),
                        this.image('https://cdn.feesource.xyz/mxzb/assets/share_cover_icon.png'),
                        this.image('https://cdn.feesource.xyz/mxzb/assets/code_official.jpg')
                    ]).then(([bg, cover, code]) => {
                        const width = this.width
                        const heigth = this.heigth
                        const canvasId = this.canvasId
                        const context = uni.createCanvasContext(canvasId, this)

                        context.drawImage(bg, 0, 0, width, heigth)
                        
                        this.box(context, {
                            left: 30,
                            top: 30,
                            width: 540,
                            height: 760,
                            radius: 10,
                            color: '#fff'
                        })
                        
                        this.textVertical(context, {
                            left: 60,
                            top: 60,
                            fontSize: 20,
                            lineHeight: 20,
                            color: '#999',
                            text: selfData.cover.date
                        })
                        this.textVertical(context, {
                            left: 490,
                            top: 400,
                            fontSize: 20,
                            lineHeight: 20,
                            color: '#999',
                            baseline: 'bottom',
                            text: '彭祖百忌'
                        })
                        this.textVertical(context, {
                            left: 521,
                            top: 60,
                            fontSize: 20,
                            lineHeight: 20,
                            color: '#666',
                            text: selfData.cover.baiji
                        })
                        context.drawImage(cover, 140, 115, 320, 280)
                        
                        this.box(context, {
                            left: 60,
                            top: 605,
                            width: 480,
                            height: 1,
                            color: '#e0e0e0'
                        })
                        this.box(context, {
                            left: 62,
                            top: 623,
                            width: 110,
                            height: 110,
                            radius: 10,
                            color: '#FFE327'
                        })
                        context.drawImage(code, 69, 630, 96, 96)
                        this.textHorizontal(context, {
                            left: 117,
                            top: 745,
                            fontSize: '18',
                            color: '#999',
                            align: 'center',
                            text: '扫码领开运指南'
                        })
                        
                        this.textHorizontal(context, {
                            left: 60,
                            top: 513,
                            fontSize: '48',
                            color: '#333',
                            baseline: 'bottom',
                            text: selfData.date.month
                        })
                        this.textHorizontal(context, {
                            left: 108,
                            top: 513,
                            fontSize: '40',
                            color: '#333',
                            baseline: 'bottom',
                            text: '月'
                        })
                        this.textHorizontal(context, {
                            left: 60,
                            top: 540,
                            fontSize: '30',
                            color: '#666',
                            text: selfData.date.year
                        })
                        
                        this.textHorizontal(context, {
                            left: 300,
                            top: 444,
                            fontSize: '140',
                            color: '#333',
                            align: 'center',
                            weight: 'bold',
                            text: selfData.date.day
                        })
                        
                        this.textHorizontal(context, {
                            left: 540,
                            top: 513,
                            fontSize: '48',
                            color: '#333',
                            align: 'right',
                            baseline: 'bottom',
                            text: selfData.date.week
                        })
                        this.textHorizontal(context, {
                            left: 492,
                            top: 513,
                            fontSize: '40',
                            color: '#333',
                            align: 'right',
                            baseline: 'bottom',
                            text: '星期'
                        })
                        this.textHorizontal(context, {
                            left: 540,
                            top: 540,
                            fontSize: '30',
                            color: '#666',
                            align: 'right',
                            text: selfData.date.nonli
                        })
                        
                        this.box(context, {
                            left: 215,
                            top: 635,
                            width: 40,
                            height: 40,
                            radius: 20,
                            color: '#C44865'
                        })
                        this.textHorizontal(context, {
                            left: 223,
                            top: 642,
                            fontSize: '24',
                            color: '#fff',
                            text: '宜'
                        })
                        this.textHorizontal(context, {
                            left: 265,
                            top: 645,
                            fontSize: '20',
                            color: '#C44865',
                            text: selfData.hint.yi
                        })
                        
                        this.box(context, {
                            left: 215,
                            top: 688,
                            width: 40,
                            height: 40,
                            radius: 20,
                            color: '#48ABC4'
                        })
                        this.textHorizontal(context, {
                            left: 223,
                            top: 695,
                            fontSize: '24',
                            color: '#fff',
                            text: '忌'
                        })
                        this.textHorizontal(context, {
                            left: 265,
                            top: 697,
                            fontSize: '20',
                            color: '#333',
                            text: selfData.hint.ji
                        })
                        
                        this.box(context, {
                            left: 30,
                            top: 820,
                            width: 540,
                            height: 160,
                            radius: 10,
                            color: '#fff'
                        })
                        this.text(context, {
                            left: 60,
                            top: 855,
                            maxWidth: 480,
                            maxLine: 3,
                            fontSize: 22,
                            lineHeight: 36,
                            color: '#666',
                            text: selfData.desc
                        })

                        context.draw(false, () => {
                            setTimeout(() => {
                                uni.canvasToTempFilePath({
                                    canvasId: canvasId,
                                    fileType: 'jpg',
                                    quality: 1,
                                    complete: res => {
                                        /ok/.test(res.errMsg) ? resolve(res.tempFilePath) : reject({
                                            message: '分享图导出失败'
                                        })
                                    }
                                }, this)
                            }, 300)
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

<style lang="scss" scoped>
    .share-cover{
        position: fixed;
        top: 100%;
        left: 100%;
        z-index: 999;
        pointer-events: none;
    }
</style>
