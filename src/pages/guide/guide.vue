<template>
    <view class="container">
        <image class="bg" src="/static/main/share_cover_bg.png"></image>
        <me-head title-text="开运指南" title-color="#fff" bar-color="transparent" home-src="/static/main/home_white.png" back-src="/static/main/back_white.png"></me-head>
        <view class="me-body">
            <view>
                <view class="block top bottom">
                    <view class="cover">
                        <view class="text left">
                            <view>{{ cover.date }}</view>
                        </view>
                        <image class="icon" src="/static/main/share_cover_icon.png"></image>
                        <view class="text right">
                            <view>彭祖百忌</view>
                            <view class="strong">{{ cover.baiji }}</view>
                        </view>
                    </view>
                    <view class="date">
                        <view>
                            <view class="big"><text>{{ date.month }}</text>月</view>
                            <view class="small">{{ date.year }}</view>
                        </view>
                        <view class="center">{{ date.day }}</view>
                        <view>
                            <view class="big">星期<text>{{ date.week }}</text></view>
                            <view class="small">{{ date.nonli }}</view>
                        </view>
                    </view>
                    <view class="hint">
                        <view class="left">
                            <image class="code" src="/static/main/code_official.jpg"></image>
                            <view>扫码领开运指南</view>
                        </view>
                        <view class="right">
                            <view><view>宜</view>{{ hint.yi }}</view>
                            <view><view>忌</view>{{ hint.ji }}</view>
                        </view>
                    </view>
                </view>
                <view class="block top bottom desc">{{ desc }}</view>
            </view>
            <view class="btn-wrap">
                <button v-if="showConfig.guideShareCover" class="btn hover save" @longpress="showShareCover">长按保存</button>
                <button class="btn hover share" open-type="share">点击分享</button>
            </view>
        </view>
        <share-cover ref="shareCover"></share-cover>
        <me-login ref="meLogin"></me-login>
    </view>
</template>

<script>
    import { pages, config } from '@/common/vue.expand'
    import { dateMsec, dateFormat } from '@/common/util'
    
    import meHead from '@/components/meHead'
    import meLogin from '@/components/meConfirm/meLogin'
    import shareCover from './shareCover'
    
    const selfData = {
        numberCN: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    }
    
    export default {
        mixins: [pages, config],
        components: {
            meHead,
            meLogin,
            shareCover
        },
        data() {
            return {
                cover: {
                    date: '',
                    baiji: ''
                },
                date: {
                    month: '',
                    year: '',
                    week: '',
                    day: '',
                    nonli: ''
                },
                hint: {
                    yi: '',
                    ji: ''
                },
                desc: ''
            }
        },
        onShow() {
            this.isAuth().then(() => {
                this.getData()
            })
        },
        methods: {
            getData() {
                this.$Loading.show()
                Promise.resolve(this.$Storage.get('currentDayGuideData')).then(data => {
                    return data ? data : Promise.all([
                        this.$io.service('~|divine-draw/almanac').get(null).then(res => {
                            const [year, month, day, week] = dateFormat(new Date(), '{yyyy},{mm},{dd},{a}').split(',')
                            return {
                                cover: {
                                    date: res.data.yinli.replace(/\((.)\)年/, (all, type) => '年【' + type + '年】'),
                                    baiji: res.data.baiji
                                },
                                date: {
                                    month: parseInt(month).toString().split('').map(val => selfData.numberCN[val]).join(''),
                                    year: year.split('').map(val => selfData.numberCN[val]).join(''),
                                    week: week,
                                    day: day,
                                    nonli: res.data.yinli.replace(/^.+\)年/, ''),
                                },
                                hint: {
                                    yi: res.data.yi.split(/\s+/).slice(0, 6).join(' '),
                                    ji: res.data.ji.split(/\s+/).slice(0, 6).join(' ')
                                }
                            }
                        }),
                        this.$io.service('~|divine-draw/note').get(null).then(res => res.data)
                    ]).then(([calendar, essay]) => {
                        const data = {
                            cover: calendar.cover,
                            date: calendar.date,
                            hint: calendar.hint,
                            desc: essay
                        }
                        this.$Storage.set('#currentDayGuideData', data, dateFormat(new Date().getTime() + dateMsec.d, '{yyyy}-{mm}-{dd}'))
                        return data
                    })
                }).then(data => {
                    this.cover = data.cover
                    this.date = data.date
                    this.hint = data.hint
                    this.desc = data.desc
                }).catch(err => {
                    this.$Toast.show({
                        title: err && err.message || '数据获取失败',
                        closeSend: true
                    }).then(() => {
                        this.$Router.back()
                    })
                }).finally(() => {
                    this.$Loading.hide(true)
                })
            },
            showShareCover() {
                this.$refs.shareCover.show({
                    cover: this.cover,
                    date: this.date,
                    hint: this.hint,
                    desc: this.desc
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @font-face{
        font-family: 'PingFang';
        src: url('~@/static/main/PingFang.ttf');
    }
    .bg{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .me-body{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 60upx 105upx 30upx;
    }
    .block{
        & + .block{
            margin-top: 30upx;
        }
    }
    .cover{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .icon{
            display: block;
            width: 320upx;
            height: 280upx;
        }
        .text{
            display: flex;
            width: 3em;
            flex-direction: column;
            writing-mode: vertical-lr;
            line-height: 1.5em;
            font-size: 20upx;
            color: #999;
            &.left{
                align-self: stretch;
                justify-content: flex-start;
                font-family: 'PingFang';
            }
            &.right{
                align-items: flex-end;
                justify-content: flex-end;
            }
        }
        .strong{
            color: #666;
        }
    }
    .date{
        display: flex;
        padding: 30upx 0 20upx;
        >view{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
        }
        .center{
            flex: 1 1 auto;
            align-self: center;
            line-height: 1em;
            font-weight: bold;
            font-size: 140upx;
            color: #333;
        }
        .big{
            margin-top: 10upx;
            font-size: 40upx;
            color: #333;
            >text{
                font-size: 48upx;
            }
        }
        .small{
            margin-bottom: 10upx;
            font-size: 30upx;
            color: #666;
        }
    }
    .hint{
        display: flex;
        border-top: 1px solid rgba(#000, .12);
        padding-top: 30upx;
        .left{
            display: flex;
            flex-direction: column;
            align-items: center;
            white-space: nowrap;
            margin-right: 30upx;
            line-height: 1em;
            font-size: 18upx;
            color: #999;
        }
        .code{
            display: block;
            width: 90upx;
            height: 90upx;
            margin-bottom: 16upx;
            border-radius: 10upx;
            padding: 10upx;
            background-color: #FFE327;
        }
        .right{
            display: flex;
            flex-direction: column;
            >view{
                display: flex;
                padding: 8upx 0;
                align-items: center;
                line-height: 40upx;
                font-size: 20upx;
                >view{
                    flex-shrink: 0;
                    flex-grow: 0;
                    display: flex;
                    width: 40upx;
                    heigth: 40upx;
                    margin-right: 10upx;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    font-size: 24upx;
                    color: #fff;
                }
                &:nth-of-type(1){
                    color: #C44865;
                    >view{
                        background-color: #C44865;
                    }
                }
                &:nth-of-type(2){
                    color: #333333;
                    >view{
                        background-color: #48ABC4;
                    }
                }
            }
        }
    }
    .desc{
        text-align: justify;
        line-height: 1.75em;
        font-size: 22upx;
        color: #666;
    }
    .btn-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn{
            width: 253upx;
            height: 60upx;
            border-radius: 10upx;
            line-height: 1em;
            font-size: 24upx;
        }
        .save{
            background-color: rgba(#000, .5);
            color: #fff;
        }
        .share{
            background-color: #FFE327;
            color: #333333;
        }
    }
</style>
