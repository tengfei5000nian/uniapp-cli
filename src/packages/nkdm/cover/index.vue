<template>
    <view class="container">
        <me-head title-text="测试结果" bar-color="#fff"></me-head>
        <view class="me-body" @longpress="$refs.shareCoverBtn.show()">
            <view class="kdzs">
                <image class="size-max" src="https://cdn.feesource.xyz/bgzb/nkdm/kdzs.png"></image>
                <view class="xx">
                    <image v-for="x in xx[0]" :key="x" src="https://cdn.feesource.xyz/bgzb/nkdm/xx_selected.png"></image>
                    <image v-for="x in xx[1]" :key="x" src="https://cdn.feesource.xyz/bgzb/nkdm/xx.png"></image>
                </view>
            </view>
            <view class="remark">
                <image class="cover" src="https://cdn.feesource.xyz/bgzb/nkdm/remark.png"></image>
                <view class="user">
                    <image class="logo" :src="user.logo"></image>
                    <view class="name text-overflow" :style="{ 'font-family': family }">{{ user.name }}</view>
                    <view class="num">{{ num }}%</view>
                </view>
                <view class="text">{{ remark }}</view>
            </view>
            <view class="share">
                <image class="cover" src="https://cdn.feesource.xyz/bgzb/nkdm/share.png"></image>
                <image class="code" :src="code"></image>
                <button class="btn" open-type="share">
                    <image class="size-max" src="https://cdn.feesource.xyz/bgzb/nkdm/btn_fx.png"></image>
                </button>
            </view>
        </view>
        <share-cover-btn ref="shareCoverBtn" :options="{ code, num, xx, remark, family, user }"/>
    </view>
</template>

<script>
    import pages from '../pages.js'
    import { mapState, mapActions } from 'vuex'

    import meHead from '@/components/meHead'
    import shareCoverBtn from './shareCoverBtn'
     
    const selfData = {
        xxMax: 5
    }
    
    export default {
        mixins: [pages],
        components: {
            meHead,
            shareCoverBtn
        },
        data() {
            return {
                code: 'https://cdn.feesource.xyz/mxzb/assets/code_miniapp.png',
                num: 0,
                xx: [0, selfData.xxMax],
                remark: '',
                family: ''
            }
        },
        computed: {
            ...mapState([
                'user'
            ])
        },
        onLoad() {
            new Promise((resolve, reject) => {
                const value = this.$Storage.get('createRemark')
                typeof value === 'undefined' ? reject() : resolve(value)
            }).then(data => {
                const xs = Math.floor(data.num / (100 / selfData.xxMax))
                this.xx = [xs, selfData.xxMax - xs]
                this.remark = data.remark
                this.num = data.num
            }).catch(err => {
                this.$Toast.show({
                    title: '测试数丢失据',
                    closeSend: true
                }).then(() => {
                    this.$Router.back()
                })
            })
            this.fontCreate({
                str: this.user.name,
                font: '方正清刻本悦宋简体'
            }).then(res => {
                this.family = res
            })
        },
        methods: {
            ...mapActions([
                'fontCreate'
            ])
        }
    }
</script>

<style lang="scss" scoped>
    @font-face{
        font-family: 'HYXiaoMaiTiJ';
        src: url('./HYXiaoMaiTiJ.ttf');
    }
    .me-body{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        padding: 40upx 0 20upx;
        background: url(https://cdn.feesource.xyz/bgzb/nkdm/answer_bg.png) repeat center center / 21upx 21upx #fbde62;
    }
    .kdzs{
        position: relative;
        width: 551upx;
        height: 170upx;
        .xx{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 32upx;
            display: flex;
            justify-content: center;
            >image{
                width: 36upx;
                height: 36upx;
                margin: 0 17upx;
            }
        }
    }
    .remark{
        position: relative;
        width: 662upx;
        .cover{
            display: block;
            width: 558upx;
            height: 715upx;
            margin-left: auto;
        }
        .user{
            position: absolute;
            top: 18upx;
            left: -40upx;
            display: flex;
            width: 200upx;
            flex-direction: column;
            align-items: center;
        }
        .logo{
            display: block;
            width: 100upx;
            height: 100upx;
            border-radius: 50%;
            background-color: #502a20;
        }
        .name{
            margin-top: 10upx;
            line-height: 1.2em;
            font-size: 30upx;
            color: #490b0d;
        }
        .num{
            line-height: 1.2em;
            font-family: 'HYXiaoMaiTiJ';
            font-weight: bold;
            font-size: 89upx;
            color: #f1180f;
        }
        .text{
            position: absolute;
            top: 28upx;
            right: 35upx;
            width: 435upx;
            text-align: justify;
            line-height: 36upx;
            font-size: 24upx;
            color: #490b0d;
        }
    }
    .share{
        position: relative;
        height: 168upx;
        .cover{
            width: 640upx;
            height: 156upx;
        }
        .code{
            position: absolute;
            right: 0;
            bottom: 0;
            width: 150upx;
            height: 150upx;
        }
        .btn{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 200upx;
            height: 60upx;
        }
    }
</style>
