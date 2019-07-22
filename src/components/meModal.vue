<template>
    <block v-if="seat">
        <view v-show="isShow" :class="className" class="me-modal">
            <view v-if="bg" :class="{ close: isClose }" class="me-modal-bg" @tap="tapBg"></view>
            <slot name="header"></slot>
            <view :class="{ close: isClose }" class="me-modal-box" @animationend="closeAnimate">
                <slot></slot>
            </view>
            <slot name="footer"></slot>
        </view>
    </block>
    <block v-else>
        <view v-if="isShow" :class="className" class="me-modal">
          <view v-if="bg" :class="{ close: isClose }" class="me-modal-bg" @tap="tapBg"></view>
          <slot name="header"></slot>
          <view :class="{ close: isClose }" class="me-modal-box" @animationend="closeAnimate">
            <slot></slot>
          </view>
          <slot name="footer"></slot>
        </view>
    </block>
</template>

<script>
    import 'animate.css/source/fading_entrances/fadeIn.css'
    import 'animate.css/source/fading_entrances/fadeInUp.css'
    import 'animate.css/source/fading_exits/fadeOut.css'
    import 'animate.css/source/bouncing_exits/bounceOut.css'
    
    let selfData = null

    export default {
        props: {
            className: {
                type: [String, Array],
                default: ''
            },
            show: {
                type: Boolean,
                default: false
            },
            seat: {
                type: Boolean,
                default: false
            },
            bg: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                isShow: false,
                isClose: false
            }
        },
        watch: {
            show: {
                handler(val) {
                    this.isShow = val
                },
                immediate: true
            }
        },
        methods: {
            open() {
                this.isShow = true
            },
            close(callback) {
                if (this.isShow) {
                    this.isClose = true
                    if (typeof callback === 'function') selfData = callback
                }
            },
            closeAfter() {
                this.isShow = false
                this.isClose = false
                if (typeof selfData === 'function') {
                    selfData()
                    selfData = null
                }
            },
            closeAnimate() {
                this.isClose && this.closeAfter()
            },
            tapBg() {
                this.$emit('tapBg')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .me-modal{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
        &.absolute{
            position: absolute;
        }
    }
    .me-modal-bg{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-color: rgba(#000, .5);
        animation: fadeIn .3s both;
        &.disabled{
            pointer-events: none;
        }
        &.close{
            animation: fadeOut .3s both;
        }
    }
    .me-modal-box{
        position: relative;
        z-index: 2;
        animation: fadeInUp .3s both;
        &.close{
            animation: bounceOut .3s both;
        }
    }
</style>