<template>
    <view class="container">
        <me-head title-text="你坑爹吗" bar-color="#fff"></me-head>
        <view class="me-body" @tap="$Router.push('/packages/nkdm/answer/index')">
            <image class="nkdm" src="https://cdn.feesource.xyz/bgzb/nkdm/nkdm.png"></image>
            <image class="boy-dad" src="https://cdn.feesource.xyz/bgzb/nkdm/boy_dad.png"></image>
            <image class="play" src="https://cdn.feesource.xyz/bgzb/nkdm/play.png"></image>
        </view>
        <me-login ref="meLogin"></me-login>
    </view>
</template>

<script>
    import pages from '../pages.js'
    
    import meHead from '@/components/meHead'
    import meLogin from '@/components/meConfirm/meLogin'
    
    export default {
        mixins: [pages],
        components: {
            meHead,
            meLogin
        },
        mounted() {
            this.isAuth()
        }
    }
</script>

<style lang="scss" scoped>
    .me-body{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        background: url(https://cdn.feesource.xyz/bgzb/nkdm/answer_bg.png) repeat center center / 21upx 21upx #fbde62;
    }
    .nkdm{
        display: block;
        width: 615upx;
        height: 144upx;
        margin-bottom: -30upx;
    }
    .boy-dad{
        display: block;
        width: 665upx;
        height: 915upx;
    }
    .play{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 165upx;
        height: 165upx;
        margin: auto;
        animation: play 1s linear 0s infinite alternate backwards;
        @keyframes play {
            0%{
                opacity: 1;
                transform: scale(1);
            }
            100%{
                opacity: .8;
                transform: scale(1.1);
            }
        }
    }
</style>
