export default {
    onShareAppMessage(e) {
        const format = this.onShareAppMessage
        const config = {
            title: '解惑当下，预见未来',
            // imageUrl: '/static/main/share.png',
            path: '/pages/home/home'
        }
        return typeof format === 'function' ? format(config, e) : config
    },
    methods: {
        isAuth() {
            return new Promise(resolve => {
                (this.$io.io || this.$io.primus || {}).authenticated ? resolve() : this.$store.dispatch('userCall', this.$Route.query).then(resolve).catch(err => {
                    Promise[this.$root.$refs.meLogin ? 'resolve' : 'reject']().then(() => {
                        return this.$root.$refs.meLogin.open().then(resolve)
                    }).catch(err => {
                        this.$Route.path === appConfig.path.home || this.$Toast.show({
                            title: '未授权，请先登录！',
                            closeSend: true
                        }).then(() => {
                            this.$Router.push({
                                path: appConfig.path.home,
                                type: 'reLaunch'
                            })
                        })
                    })
                })
            })
        }
    }
}