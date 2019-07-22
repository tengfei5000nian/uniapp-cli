<template>
	<view class="container">
		<me-head title-text="明星占卜" bar-color="#FFE327"></me-head>
        <view class="me-body">
            <image class="bg" src="/static/main/banner.png"></image>
            <official-account class="official"></official-account>
            <view class="block top bottom shadow current-day">
                <view class="desc">
                    <view>{{ date.date }}</view>
                    <view>{{ date.week }}<text v-if="date.constellation">|</text>{{ date.constellation }}</view>
                    <view v-if="regeo">{{ regeo }}<text>{{ weather.temperature }}</text>{{ weather.weather }}</view>
                </view>
                <image v-if="weather.weatherIcon" class="tq" :src="weather.weatherIcon" mode="aspectFit"></image>
            </view>
            <view v-if="showConfig.homeFourEntry" class="block top four-entry">
                <me-link class-name="item default" :to="{ appid: 'wx94cda964d74858b5', path: '/pages/index/main?path=%2fpages%2ftabbar%2fmain%3fpath%3dhome' }">
                    <text class="title">八字排盘</text>
                    <image class="logo" src="/static/product/miniapp_pp.png" mode="aspectFit"></image>
                </me-link>
                <me-link class-name="item hot" :to="{ appid: 'wxc2a3d42ea6754673', path: '/pages/product/product' }">
                    <text class="title">真人1v1</text>
                    <image class="logo" src="/static/product/product_zr.png" mode="aspectFit"></image>
                    <image class="icon" src="/static/main/hot.png" mode="scaleToFill"></image>
                </me-link>
                <me-link class-name="item default" :to="{ appid: 'wxb6e4f226801f7e31', path: '/pages/index/main?path=%2fpages%2fshake%2fmain%3ftype%3dyuelao' }">
                    <text class="title">月老灵签</text>
                    <image class="logo" src="/static/product/miniapp_yl.png" mode="aspectFit"></image>
                </me-link>
                <me-link class-name="item default" :to="{ appid: 'wxb6e4f226801f7e31', path: '/pages/index/main?path=%2fpages%2fshake%2fmain%3ftype%3dcaishenye' }">
                    <text class="title">财神灵签</text>
                    <image class="logo" src="/static/product/miniapp_cs.png" mode="aspectFit"></image>
                </me-link>
            </view>
            <view v-if="showConfig.homeSwiperEntry" class="block top bottom swiper-entry">
                <miniapp-swiper :list="swiperEntry"></miniapp-swiper>
            </view>
            <view class="block top bottom two-entry">
                <me-link class-name="item" to="/pages/guide/guide">
                    <image src="/static/product/product_zn.png" mode="aspectFit"></image>
                    <view>开运指南</view>
                </me-link>
                <me-link v-if="showConfig.homeTwoEntry" class-name="item" :to="{ appid: 'wxc2a3d42ea6754673', path: '/pages/test/index' }">
                    <image src="/static/product/miniapp_cz.png" mode="aspectFit"></image>
                    <view>占卜测字</view>
                </me-link>
            </view>
        </view>
        <me-login ref="meLogin" :options="{ close: true }"></me-login>
        <to-setup ref="toSetup"></to-setup>
	</view>
</template>

<script>
    import { dateFormat } from '@/common/util'
    import { tabbar, pages, config } from '@/common/vue.expand'
    
    import meHead from '@/components/meHead'
    import toSetup from '@/components/meConfirm/toSetup'
    import meLogin from '@/components/meConfirm/meLogin'
    import miniappSwiper from '@/components/miniappSwiper'
    import meLink from '@/components/meLink'
    
    const selfData = {
        weather: {
            '晴': ['晴', '平静', '热', '冷', '未知'],
            '风': ['有风', '微风', '和风', '清风', '强风/劲风', '疾风', '大风', '烈风', '风暴', '狂爆风', '飓风', '热带风暴', '龙卷风'],
            '云': ['少云', '晴间多云', '多云'],
            '阴': ['阴', '浮尘', '扬沙', '沙尘暴', '强沙尘暴', '雾', '浓雾', '强浓雾', '轻雾', '大雾', '特强浓雾', '霾', '中度霾', '重度霾', '严重霾'],
            '雨': ['阵雨', '小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨', '强阵雨', '强雷阵雨', '极端降雨', '毛毛雨/细雨', '雨', '小雨-中雨', '中雨-大雨', '大雨-暴雨', '暴雨-大暴雨', '大暴雨-特大暴雨', '冻雨'],
            '雷': ['雷阵雨', '雷阵雨并伴有冰雹'],
            '雪': ['雨雪天气', '雨夹雪', '阵雨夹雪', '雪', '阵雪', '小雪', '中雪', '大雪', '暴雪', '小雪-中雪', '中雪-大雪', '大雪-暴雪']
        },
        weatherIcon: {
            '晴': '/static/main/tq_qing.png',
            '风': '/static/main/tq_feng.png',
            '云': '/static/main/tq_yun.png',
            '阴': '/static/main/tq_yin.png',
            '雨': '/static/main/tq_yu.png',
            '雷': '/static/main/tq_lei.png',
            '雪': '/static/main/tq_xue.png'
        }
    }
    
	export default {
        mixins: [tabbar, pages, config],
        components: {
            meHead,
            meLogin,
            toSetup,
            miniappSwiper,
            meLink
        },
		data() {
			return {
                regeo: '',
                weather: {
                    temperature: '',
                    weather: '',
                    weatherIcon: ''
                },
                date: {
                    constellation: '',
                    date: '',
                    week: ''
                },
				swiperEntry: []
			}
		},
        onShow() {
            this.isAuth().then(() => {
                this.getCurrentSeat()
                this.getMiniapp()
            })
        },
		methods: {
			getCurrentSeat() {
                const { dispatch } = this.$store
                Promise.all([
                    // 获取位置、气象
                    new Promise((resolve, reject) => {
                        Promise.all([
                            // 获取位置
                            dispatch('amapGet', { key: 'getRegeo' }).then(res => {
                                const data = (((res || [])[0] || {}).regeocodeData || {}).addressComponent || {}
                                const isStr = val => typeof val === 'string' && val.length ? val : ''
                                return (isStr(data.city) || isStr(data.district) || isStr(data.province) || '当地').replace(/(省|市|区|乡|镇|村)$/, '')
                            }),
                            // 获取气象
                            dispatch('amapGet', { key: 'getWeather' }).then(res => {
                                const temperature = (res.temperature || {}).data || '26'
                                const weather = (res.weather || {}).data || '晴'
                                const weatherFormat = Object.keys(selfData.weather).find(key => selfData.weather[key].includes(weather)) || '晴'
                                return {
                                    temperature: temperature + '℃',
                                    weather: weatherFormat,
                                    weatherIcon: selfData.weatherIcon[weatherFormat]
                                }
                            })
                        ]).then(resolve).catch(err => {
                            resolve([])
                            // #ifdef MP-WEIXIN || MP-BAIDU
                            this.$refs.toSetup.open('<div style="text-align:center;">位置及气象信息获取失败<br/>请确认是否授权</div>')
                            // #endif
                        })
                    }),
                    // 获取日期、星座
                    Promise.resolve(dateFormat(new Date(), '{yyyy}年{mm}月{dd}日,星期{a},{x}座')).then(res => {
                        const [date, week, constellation] = res.split(',')
                        return { date, week, constellation }
                    })
                ]).then(([[regeo, weather], date]) => {
                    if (regeo) this.regeo = regeo
                    if (weather) this.weather = weather
                    this.date = date
                }).catch(err => {
                    this.$Toast.show(err && err.message || '日历及气象信息获取失败！')
                })
            },
            getMiniapp() {
                this.$store.getters.config.mxzb_config_miniapp.then(res => {
                    const filter = res.filter.page_home_swiper
                    this.swiperEntry = res.data.filter((item, index) => !filter.includes(index))
                }).catch(err => {
                    this.$Toast.show(err && err.message || '小程序列表获取失败！')
                })
            }
		}
	}
</script>

<style lang="scss">
    .me-body{
        position: relative;
        padding: 0 30upx;
        overflow: hidden;
        >.bg{
            position: absolute;
            top: 0;
            left: 0;
            width: 750upx;
            height: 290upx;
        }
        >.official{
            position: absolute;
            top: 0;
            left: 30upx;
            width: 690upx;
            height: 170upx;
        }
        >.block{
            position: relative;
            margin-bottom: 30upx;
        }
    }
    .current-day{
        display: flex;
        margin-top: 190upx;
        align-items: center;
        >.desc{
            flex: 1 1 auto;
            >view{
                line-height: 1em;
                color: #333333;
                &:nth-of-type(1){
                    font-size: 30upx;
                }
                &:nth-of-type(2){
                    margin-top: 19upx;
                    font-size: 22upx;
                    >text{
                        margin: 0 .6em;
                    }
                }
                &:nth-of-type(3){
                    margin-top: 16upx;
                    font-size: 20upx;
                    color: #999999;
                    >text{
                        margin: 0 1em;
                    }
                }
            }
        }
        >.tq{
            display: block;
            width: 120upx;
            height: 120upx;
        }
    }
    .four-entry{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-bottom: 10upx;
        .item{
            position: relative;
            display: flex;
            width: 317upx;
            height: 155upx;
            align-items: center;
            justify-content: center;
            margin-bottom: 20upx;
            border-radius: 10upx;
            background-color: #EEEEEE;
            overflow: hidden;
            >.title{
                margin-right: 30upx;
                line-height: 1em;
                font-size: 32upx;
            }
            >.logo{
                display: block;
            }
            &.default{
                >.title{
                    color: #333333;
                }
                >.logo{
                    width: 96upx;
                    height: 96upx;
                }
            }
            &.hot{
                background-color: #F6C8B2;
                >.title{
                    color: #CD3E43;
                }
                >.logo{
                    width: 80upx;
                    height: 126upx;
                    margin-top: auto;
                }
                >.icon{
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 44upx;
                    height: 50upx;
                }
            }
        }
    }
    .two-entry{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item{
            position: relative;
            >image{
                display: block;
                width: 315upx;
                height: 132upx;
            }
            >view{
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                line-height: 1em;
                font-size: 50upx;
                color: #ffffff;
            }
        }
    }
</style>
