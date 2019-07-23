<template>
	<me-confirm ref="meConfirm" :options="confirmOptions" @confirm="getUserInfo">
        <image class="cover" src="/static/main/share_cover_icon.png"></image>
    </me-confirm>
</template>

<script>
    import appConfig from '@/config'
    import meConfirm from '@/components/meConfirm'
    import { queryStringify } from '@/common/util'
    
    let selfData = []
    
	export default {
        components: {
            meConfirm
        },
        props: {
            options: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        computed: {
            confirmOptions() {
                return {
                    close: false,
                    ...this.options,
                    title: '明星占卜',
                    message: '占卜问事 祈福许愿',
                    btnEvent: 'confirm',
                    btnValue: '微信授权',
                    // #ifdef MP-WEIXIN
                    btnType: 'user'
                    // #endif
                }
            }
        },
        created() {
            this.$io.on('meLogin', is => {
                const meConfirm = this.$refs.meConfirm
                if (is !== meConfirm.isShow()) {
                    is ? meConfirm.open().catch(err => this.promise('reject', err)) : meConfirm.close()
                }
            })
        },
        methods: {
            open() {
                this.$io.emit('meLogin', true)
                return new Promise((resolve, reject) => {
                    selfData.push({ resolve, reject })
                })
            },
            getUserInfo(e) {
                // #ifdef MP-WEIXIN
                const target = e.target || {}
                const { encryptedData, iv, userInfo } = target
                if (encryptedData && iv && userInfo) {
                    this.userLogin(target)
                } else {
                    this.$Toast.show('授权失败，请重新尝试！')
                }
                // #endif
                // #ifdef H5
                const route = this.$Route
                const query = queryStringify(route.query, ['code'])
                const currentHref = encodeURIComponent(route.origin + route.path + (query ? '?' : '') + query)
                location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appConfig.appid.h5}&redirect_uri=${currentHref}&response_type=code&scope=snsapi_userinfo#wechat_redirect`
                // #endif
            },
            userLogin(target) {
                const { encryptedData, iv, userInfo } = target
                const { avatarUrl, nickName, gender } = userInfo
                const { inviterId, channelId, ald_media_id, ald_link_key } = this.$Route.query
                this.$store.dispatch('userLogin', {
                    encryptedData,
                    iv,
                    avatarUrl,
                    nickName,
                    gender,
                    inviterId,
                    channelId,
                    ald_media_id,
                    ald_link_key
                }).then(res => {
                    this.promise('resolve', res)
                    this.$io.emit('meLogin', false)
                    this.$Toast.show('登录成功！')
                }).catch(err => {
                    this.$Toast.show(err && err.message || '登录失败，请重新尝试！')
                })
            },
            promise(type, e) {
                selfData.forEach(promise => {
                    promise[type](e)
                })
                selfData = []
            }
        }
	}
</script>

<style lang="scss" scoped>
    .cover{
        display: block;
        width: 160upx;
        height: 150upx;
    }
</style>
