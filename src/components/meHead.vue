<template>
    <!-- #ifdef MP-WEIXIN -->
        <block>
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
        <view class="me-head">
    <!-- #endif -->
        <view class="fixed bar" :style="[bar.color, bar.height]">
            <view v-if="headHas" class="head" :style="[head.color]">
                <view class="title" :style="[title.color, title.border]">{{ titleText }}</view>
                <!-- #ifndef MP-ALIPAY -->
                <button v-if="btn.back" class="btn hover" @tap="toBack">
                    <image :src="backSrc"></image>
                </button>
                <button v-if="btn.home" class="btn hover" @tap="toHome">
                    <image :src="homeSrc"></image>
                </button>
                <!-- #endif -->
                <slot></slot>
            </view>
        </view>
        <view class="seat bar" :style="[bar.height]">
            <view v-if="headHas" class="head"></view>
        </view>
    <!-- #ifdef MP-WEIXIN -->
        </block>
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
        </view>
    <!-- #endif -->
</template>

<script>
    import appConfig from '@/config'
    
    const barHeight = (uni.getSystemInfoSync() || {}).statusBarHeight || 0
    
    export default {
        props: {
            barColor: {
                type: String,
                default: '#fff'
            },
            headColor: {
                type: String,
                default: 'transparent'
            },
            headBorder: {
                type: String,
                default: 'transparent'
            },
            headHas: {
                type: Boolean,
                default: true
            },
            titleColor: {
                type: String,
                default: '#333'
            },
            titleText: {
                type: String,
                default: ''
            },
            homeShow: {
                type: Boolean,
                default: false
            },
            homeSrc: {
                type: String,
                default: '/static/main/home_black.png'
            },
            backSrc: {
                type: String,
                default: '/static/main/back_black.png'
            }
        },
        computed: {
            height() {
                return barHeight + 44
            },
            bar() {
                const color = {
                    background: this.barColor
                }
                const height = {
                    paddingTop: barHeight ? barHeight + 'px' : ''
                }
                return { color, height }
            },
            head() {
                const color = {
                    background: this.headColor
                }
                return { color }
            },
            title() {
                const color = {
                    color: this.titleColor
                }
                const border = {
                    borderBottom: `1px solid ${this.headBorder}`
                }
                return { color, border }
            },
            btn() {
                const route = this.$Route
                let back = false
                let home = false
                if (route.pages.length <= 1) {
                    if (route.path !== appConfig.path.home && !appConfig.path.tabbar.includes(route.path)) home = true
                } else {
                    back = true
                    if (this.homeShow) home = true
                }
                return { back, home }
            }
        },
        methods: {
            toBack() {
                this.$Router.back()
            },
            toHome() {
                const { home, tabbar } = appConfig.path || {}
                this.$Router.push({
                    path: home,
                    type: (tabbar || []).includes(appConfig.path.home) ? 'switchTab' : ''
                })
            }
        }
    }
</script>

<style lang="scss">
    @mixin root {
        position: relative;
        z-index: 99;
        flex-shrink: 0;
        flex-grow: 0;
    }
    :host{
        display: block;
        @include root;
    }
    .me-head{
        @include root;
    }
</style>

<style lang="scss" scoped>
    $headHeight: 44px;
    .fixed{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99;
    }
    .bar{
        padding-top: var(--status-bar-height);
    }
    .head{
        position: relative;
        @include flex-align(flex-start, center);
        height: $headHeight;
    }
    .title{
        position: absolute;
        z-index: 1;
        @include syxz(0, 0, 0, 0);
        @include flex-align(center, center);
        box-sizing: border-box;
        line-height: 1em;
        font-size: 18px;
    }
    .btn{
        position: relative;
        z-index: 2;
        width: $headHeight;
        height: $headHeight;
        > image{
            display: block;
            width: 24px;
            height: 24px;
        }
    }
</style>
