<template>
    <view class="container">
        <me-head title-text="领取准考证" bar-color="#f5f5f5"></me-head>
        <view class="me-body">
            <view class="gk-block top-radius bottom-radius">
                <view class="main">
                    <image class="size-max" src="https://cdn.feesource.xyz/bgzb/gkdj/zkz.png"></image>
                    <view class="title">{{ certificate.title }}</view>
                    <view class="logo">
                        <image class="size-max" :src="certificate.logo"></image>
                    </view>
                    <view class="id">{{ certificate.id }}</view>
                    <view class="name">{{ certificate.name }}</view>
                    <view class="sex">{{ certificate.sex }}</view>
                    <view class="age">{{ certificate.age }}</view>
                    <view class="table">
                        <view class="h">月 日</view>
                        <view class="t">9:30-11:30</view>
                        <view class="t">15:00-17:00</view>
                        <view class="h">6月7日</view>
                        <view class="t">语文</view>
                        <view class="t">数学</view>
                        <view class="h">6月8日</view>
                        <view class="t">{{ zhonhe }}</view>
                        <view class="t">外语</view>
                    </view>
                </view>
                <view class="gk-btn-wrap flex-center">
                    <share-cover-btn :options="{ certificate, zhonhe }" class-name="btn gk-style-white hover">生成分享图</share-cover-btn>
                    <button class="btn gk-style-white hover" open-type="share">晒准考证</button>
                </view>
            </view>
            <button class="btn gk-style-red hover" @click="$Router.push('/packages/gkdj/test/index')">开始考试</button>
        </view>
        <me-login ref="meLogin"></me-login>
    </view>
</template>

<script>
    import '../style.scss'
    
    import pages from '../pages.js'
    import { certificateFormat, examData } from '../main'
    
    import meHead from '@/components/meHead'
    import meLogin from '@/components/meConfirm/meLogin'
    import shareCoverBtn from './shareCoverBtn'

    export default {
        mixins: [pages],
        components: {
            meHead,
            meLogin,
            shareCoverBtn
        },
        data() {
            return {
                zhonhe: '',
                certificate: {}
            }
        },
        onShow() {
            this.isAuth().then(() => {
                this.zhonhe = examData(true).examSelect[0]
                this.certificate = certificateFormat(this.$store.state.user)
            })
        },
        methods: {
            shareTitle() {
                return this.certificate.title
            }
        }
    }
</script>

<style lang="scss">
    .gk-btn-wrap{
        .btn{
            margin: 35upx 60upx 5upx;
        }
    }
</style>

<style lang="scss" scoped>
    .me-body{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #f5f5f5;
    }
    .gk-block{
        padding: 30upx 0 45upx;
    }
    .main{
        position: relative;
        width: 738upx;
        height: 820upx;
        margin: 0 auto;
    }
    .logo{
        position: absolute;
        top: 165upx;
        left: 55upx;
        width: 211upx;
        height: 211upx;
        box-sizing: border-box;
        border-radius: 10upx;
        border: 1px solid #333;
        background-color: #eee;
        overflow: hidden;
    }
    .title{
        position: absolute;
        top: 30upx;
        left: 0;
        right: 0;
        text-align: center;
        line-height: 1.2em;
        font-weight: bold;
        font-size: 26upx;
        color: #333;
    }
    .id, .name, .sex, .age{
        position: absolute;
        line-height: 1.2em;
        font-weight: bold;
        font-size: 28upx;
        color: #666;
    }
    $top: 181upx;
    $step: 50upx;
    .id{
        top: $top;
        left: 470upx;
    }
    .name, .sex, .age{
        left: 415upx;
    }
    .name{
        top: $top + $step * 1;
    }
    .sex{
        top: $top + $step * 2;
    }
    .age{
        top: $top + $step * 3;
    }
    .table{
        position: absolute;
        bottom: 0;
        left: 30upx;
        right: 30upx;
        display: flex;
        flex-wrap: wrap;
        >view{
            display: flex;
            height: 80upx;
            justify-content: center;
            align-items: center;
            line-height: 1.2em;
            font-weight: bold;
            font-size: 26upx;
            color: #999;
        }
        .h{
            width: 26%;
            letter-spacing: 4upx;
        }
        .t{
            width: 37%;
        }
    }
    .gk-style-red{
        margin: 55upx 30upx;
    }
</style>
