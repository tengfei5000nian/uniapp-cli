<template>
    <!-- #ifdef MP-WEIXIN -->
        <block>
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
        <view class="user-logo">
    <!-- #endif -->
        <image class="logo" :style="[logo.style]" :src="logo.src"></image>
    <!-- #ifdef MP-WEIXIN -->
        </block>
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
        </view>
    <!-- #endif -->
</template>

<script>
    const userLogoDefault = '/static/main/user_logo_default.png'
    
    export default {
        props: {
            src: {
                type: String,
                default: userLogoDefault
            },
            size: {
                type: String,
                default: '100px'
            }
        },
        computed: {
            logo() {
                const src = this.src || this.$store.state.user.logo || userLogoDefault
                const size = this.size.replace(/(\d+)upx/, (all, val) => {
                    return uni.upx2px(parseFloat(val)) + 'px'
                })
                const style = {
                    width: size,
                    height: size
                }
                return { src, style }
            }
        }
    }
</script>

<style lang="scss">
    @mixin root {
        overflow: hidden;
        background-color: #e3eff5;
    }
    :host{
        display: block;
        @include root;
    }
    .user-logo{
        @include root;
    }
</style>

<style lang="scss" scoped>
    .logo{
        display: block;
    }
</style>
