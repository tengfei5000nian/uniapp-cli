<template>
	<view class="container">
		<me-head title-text="休闲测试" bar-color="#FFE327"></me-head>
        <view class="me-body">
            <view class="block top banner-entry">
                <me-link class-name="item" to="/packages/nkdm/index/index">
                    <image class="size-max" src="/static/product/miniapp_kd_banner.png" mode="aspectFill"></image>
                </me-link>
                <me-link class-name="item" to="/packages/gkdj/index/index">
                    <image class="size-max" src="/static/product/miniapp_bm_banner.png" mode="aspectFill"></image>
                </me-link>
                <me-link v-if="showConfig.testBannerEntry" class-name="item" :to="{ appid: 'wxc2a3d42ea6754673', path: '/pages/product/product' }">
                    <image class="size-max" src="/static/product/product_zr_banner.png" mode="aspectFill"></image>
                </me-link>
            </view>
            <view class="block top bottom two-entry">
                <me-link class-name="item" to="/packages/qyqx/index/index">
                    <image src="/static/product/miniapp_qx.png" mode="aspectFit"></image>
                </me-link>
                <me-link v-if="showConfig.testTwoEntry" class-name="item" :to="{ appid: 'wxb6e4f226801f7e31', path: '/pages/index/main?path=%2fpages%2fshake%2fmain%3ftype%3dguanyin' }">
                    <image src="/static/product/miniapp_zc.png" mode="aspectFit"></image>
                </me-link>
            </view>
            <view v-if="showConfig.testSwiperEntry" class="block top bottom swiper-entry">
                <miniapp-swiper :list="swiperEntry"></miniapp-swiper>
            </view>
        </view>
        <me-login ref="meLogin"></me-login>
	</view>
</template>

<script>
    import { tabbar, pages, config } from '@/common/vue.expand'
    
    import meHead from '@/components/meHead'
    import meLogin from '@/components/meConfirm/meLogin'
    import miniappSwiper from '@/components/miniappSwiper'
    import meLink from '@/components/meLink'
    
	export default {
        mixins: [tabbar, pages, config],
        components: {
            meHead,
            meLogin,
            miniappSwiper,
            meLink
        },
		data() {
			return {
				swiperEntry: []
			}
		},
        onShow() {
            this.isAuth().then(() => {
                this.getMiniapp()
            })
        },
		methods: {
			getMiniapp() {
			    this.$store.getters.config.mxzb_config_miniapp.then(res => {
			        const filter = res.filter.page_test_swiper
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
        padding: 30upx 30upx 0;
        overflow: hidden;
        >.bg{
            position: absolute;
            top: 0;
            left: 0;
            width: 750upx;
            height: 290upx;
        }
        >.block{
            position: relative;
            margin-bottom: 30upx;
        }
    }
    .banner-entry{
        display: flex;
        padding-bottom: 10upx;
        flex-direction: column;
        .item{
            height: 230upx;
            margin-bottom: 20upx;
        }
    }
    .two-entry{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item{
            >image{
                display: block;
                width: 315upx;
                height: 132upx;
            }
        }
    }
</style>
