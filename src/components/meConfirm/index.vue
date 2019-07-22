<template>
    <me-modal ref="meModal">
        <view class="box me-dialog">
            <view v-if="dialog.title" class="header flex-center">{{ dialog.title }}</view>
            <button v-if="dialog.close" class="btn hover close" @tap="promise(false)">
                <image class="size-max" src="/static/main/dialog_close.png"></image>
            </button>
            <view class="body flex-center">
                <slot></slot>
                <view class="message" v-html="dialog.message"></view>
            </view>
            <view class="footer flex-center">
                <button v-if="dialog.btnType === 'user'" open-type="getUserInfo" class="btn hover confirm" @getuserinfo="event">{{ dialog.btnValue }}</button>
                <button v-else-if="dialog.btnType === 'share'" open-type="share" class="btn hover confirm" @tap="event(true)">{{ dialog.btnValue }}</button>
                <button v-else class="btn hover confirm" @tap="event(true)">{{ dialog.btnValue }}</button>
            </view>
        </view>
    </me-modal>
</template>

<script>
    import meModal from '@/components/meModal'
    
    const selfData = {
        dialog: {
            close: true,
            title: '',
            message: '',
            btnEvent: '',
            btnValue: '',
            btnType: ''
        },
        promise: {
            resolve: null,
            reject: null
        }
    }

    export default {
        components: {
            meModal
        },
        props: {
            options: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                dialog: {}
            }
        },
        methods: {
            open(options = {}) {
                this.dialog = {
                    ...selfData.dialog,
                    ...this.options,
                    ...options
                }
                this.$refs.meModal.open()
                return new Promise((resolve, reject) => {
                    selfData.promise = {
                        resolve,
                        reject
                    }
                })
            },
            close(callback) {
                this.$refs.meModal.close(callback)
            },
            event(e) {
                const btnEvent = this.dialog.btnEvent
                typeof btnEvent === 'string' && btnEvent ? this.$emit(btnEvent, e) : this.promise(e)
            },
            promise(e) {
                const promise = selfData.promise
                this.close(() => {
                    e ? (typeof promise.resolve === 'function' && promise.resolve(e)) : (typeof promise.reject === 'function' && promise.reject())
                })
            },
            isShow() {
                return this.$refs.meModal.isShow
            }
        }
    }
</script>

<style lang="scss" scoped>
    .me-dialog{
        position: relative;
        width: 514upx;
        border-radius: 10upx;
        background-color: #fff;
        overflow: hidden;
    }
    .header{
        height: 90upx;
        line-height: 1em;
        font-size: 34upx;
        color: #333;
        background-color: #FFE327;
    }
    .body{
        min-height: 150upx;
        padding: 25upx 0;
        flex-direction: column;
    }
    .footer{
        padding-bottom: 36upx;
    }
    .close{
        position: absolute;
        top: 30upx;
        right: 30upx;
        width: 30upx;
        height: 30upx;
    }
    .message{
        padding: 15upx 0;
        line-height: 1.5em;
        font-size: 26upx;
        color: #333;
    }
    .confirm{
        width: 360upx;
        height: 70upx;
        border-radius: 10upx;
        background-color: #FFE327;
        line-height: 1em;
        font-size: 32upx;
        color: #333;
    }
</style>
