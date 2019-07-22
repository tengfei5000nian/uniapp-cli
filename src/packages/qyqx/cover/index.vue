<template>
    <view class="container">
        <me-head title-text="千与千寻" bar-color="#fff"></me-head>
        <view class="me-body">
            <image class="bg blur" :src="personage.cover" mode="aspectFill"></image>
            <view class="bg-clip">
                <image class="bg" :src="personage.cover" mode="aspectFill"></image>
            </view>
            <view class="head">
                <view class="flex-center">
                    <image v-if="user.logo" class="logo" :src="user.logo"></image>
                    <view v-else class="logo flex-center">？</view>
                    <view class="name">{{ user.name }}</view>
                </view>
                <view>
                    <image class="QR-code" :src="personage.code"></image>
                </view>
            </view>
            <view class="canvas-main">
                <image class="canvas-head" src="https://cdn.feesource.xyz/bgzb/qyqx/cover_canvas_head.png"></image>
                <view class="canvas-body">
                    <image class="size-max" src="https://cdn.feesource.xyz/bgzb/qyqx/cover_canvas_body.png"></image>
                    <view class="canvas-in">
                        <view class="name">{{ personage.name }}</view>
                        <view class="nature">{{ personage.nature }}</view>
                        <view class="synopsis">{{ personage.synopsis }}</view>
                    </view>
                </view>
                <image class="canvas-footer" src="https://cdn.feesource.xyz/bgzb/qyqx/cover_canvas_footer.png"></image>
            </view>
            <image class="bg-footer" src="https://cdn.feesource.xyz/bgzb/qyqx/cover_bg_footer.png"></image>
            <image class="bg-flower" src="https://cdn.feesource.xyz/bgzb/qyqx/cover_bg_flower.png" mode="aspectFill"></image>
            <button class="btn left" @click="$refs.canvasCover.show(personage)">保存相册</button>
            <button class="btn right" open-type="share">分享好友</button>
        </view>
        <canvas-cover ref="canvasCover"/>
    </view>
</template>

<script>
    import pages from '../pages.js'
    import { mapState, mapActions } from 'vuex'

    import meHead from '@/components/meHead'
    import canvasCover from '../components/canvasCover'
    
    const selfData = {
        current: [],
        same: 2,
        pair: 8
    }
    
    export default {
        mixins: [pages],
        components: {
            meHead,
            canvasCover
        },
        data() {
            return {
                personage: {
                    code: 'https://cdn.feesource.xyz/mxzb/assets/code_miniapp.png'
                }
            }
        },
        computed: {
            ...mapState([
                'user'
            ])
        },
        mounted() {
            this.isAuth().then(() => {
                this.getData()
            })
        },
        methods: {
            getData() {
                this.$store.getters.config.qyqxConfig.then(config => {
                    const personage = (config.personage || []).filter(row => row.cover)
                    if (personage.length) {
                        this.personage = {
                            ...this.personage,
                            ...personage[Math.floor(Math.random() * personage.length)]
                        }
                    } else {
                        throw {
                            message: '错误，人物信息获取失败'
                        }
                    }
                }).catch(err => {
                    this.$Toast.show(err && err.message || '错误，配置项获取失败').then(() => {
                        this.$router.back()
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .me-body{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #402b26;
    }
    .bg-clip, .bg{
        position: absolute;
        z-index: 0;	
    }
    .bg-clip{
        left: 85upx;
        right: 85upx;
        top: 200upx;
        bottom: 220upx;
        overflow: hidden;
        .bg{
            top: -200upx;
            left: -85upx;
        }
    }
    .bg{
        width: 100vw;
        height: 100vh;
        &.blur{
            top: 0;
            left: 0;
            filter: blur(6px)
        }
    }
    .head{
        position: relative;
        z-index: 1;
        flex-shrink: 0;
        flex-grow: 0;
        display: flex;
        justify-content: space-between;
        padding: 20upx 42upx;
        .logo{
            display: block;
            width: 66upx;
            height: 66upx;
            border-radius: 50%;
            background-color: #fff;
            line-height: 1.2em;
            font-size: 50upx;
            color: #3c59ba;
        }
        .name{
            padding: 0 18upx;
            line-height: 1.2em;
            font-size: 36upx;
            color: #fff;
        }
        .QR-code{
            display: block;
            width: 90upx;
            height: 90upx;
            background-color: #fff;
        }
    }
    .canvas-main{
        position: relative;
        z-index: 1;
        flex-shrink: 0;
        flex-grow: 1;
        display: flex;
        width: 685upx;
        margin: 0 auto 212upx;
        overflow: hidden;
        flex-direction: column;
    }
    .canvas-head, .canvas-body, .canvas-footer{
        display: block;
        width: 100%;
    }
    .canvas-head, .canvas-footer{
        flex-shrink: 0;
        flex-grow: 0;
    }
    .canvas-head{
        height: 200upx;
    }
    .canvas-body{
        flex-shrink: 0;
        flex-grow: 1;
        position: relative;
        >image{
            position: absolute;
            z-index: 0;
        }
    }
    .canvas-footer{
        height: 25upx;
    }
    .canvas-in{
        position: absolute;
        z-index: 1;
        top: -45upx;
        left: 100upx;
        right: 100upx;
        bottom: 0;
        text-align: justify;
        color: #2a1c16;
        .name{
            text-align: center;
            line-height: 1.2em;
            font-size: 54upx;
        }
        .nature{
            margin-top: 30upx;
            line-height: 1.2em;
            font-size: 32upx;
        }
        .synopsis{
            margin-top: 30upx;
            line-height: 1.6em;
            font-size: 28upx;
        }
    }
    .bg-footer{
        position: absolute;
        z-index: 2;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 481upx;
    }
    .bg-flower{
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
    }
    .btn{
        position: absolute;
        z-index: 4;
        bottom: 72upx;
        width: 106upx;
        height: 106upx;
        border-radius: 50%;
        padding: 0 20upx;
        background-color: #dacfc5;
        box-shadow: 0 8upx 18upx 0 rgba(#09090a, .71);
        line-height: 34upx;
        font-weight: bold;
        font-size: 30upx;
        color: #2c1628;
        &.left{
            left: 60upx;
        }
        &.right{
            right: 60upx;
        }
    }
</style>
