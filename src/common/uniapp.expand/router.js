import { queryStringify } from '@/common/util'

export default new class {
    constructor() {
        Object.defineProperty(this, '$Route', {
            get: () => {
                const history = this._history()
                return {
                    ...this._route(history.page),
                    ...history
                }
            }
        })
        this.$Router = this
    }
    _routeFormat(location) {
        let path = ''
        let query = {}
        if (typeof location === 'string') {
            path = location
        } else if (location instanceof Object) {
            path = location.path || ''
            query = location.query || {}
        }
        return {
            path,
            query,
            fullPath: path + (Object.keys(query).length ? '?' + queryStringify(query) : '')
        }
    }
    _vm(page) {
        // #ifdef MP-WEIXIN
        return page.$vm
        // #endif
        // #ifdef MP-BAIDU || MP-TOUTIAO || MP-ALIPAY
        return page.rootVM
        // #endif
        // #ifdef H5
        return page
        // #endif
    }
    _history() {
        const pages = getCurrentPages()
        const lastIndex = pages.length - 1
        if (lastIndex < 0) {
            return {
                pages: [],
                page: {},
                vms: [],
                vm: {}
            }
        } else {
            const vms = pages.map(page => this._vm(page))
            return {
                pages,
                page: pages[lastIndex],
                vms,
                vm: vms[lastIndex]
            }
        }
    }
    _route(page) {
        // #ifdef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || H5
        const path = page.route || ''
        // #endif
        // #ifdef MP-TOUTIAO
        const path = page.__route__ || ''
        // #endif
        // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
        const query = page.options || {}
        // #endif
        // #ifdef MP-ALIPAY
        const query = ((((((page.rootVM || {}).$mp || {}).app || {}).rootVM || {}).$mp || {}).query) || {}
        // #endif
        // #ifdef H5
        const query = (page.$route || {}).query || {}
        const origin = window.location.href
        // #endif
        // #ifdef MP
        const origin = ''
        // #endif
        const route = this._routeFormat({
            path: /^\//.test(path) ? path : '/' + path,
            query
        })
        return {
            ...route,
            origin: origin.replace(new RegExp(`${route.path.replace(/[^\w]/g, w => '\\' + w)}\.\*\$`), '').replace(/\/$/, '')
        }
    }
    is(path) {
        return this.$Route.path === path
    }
    push(location, complete, fail, success) {
        const route = this._routeFormat(location)
        if (location.type === 'switchTab') {
            uni.switchTab({
                url: route.path,
                complete,
                success,
                fail
            })
        } else if (location.type === 'reLaunch') {
            uni.reLaunch({
                url: route.fullPath,
                complete,
                success,
                fail
            })
        } else {
            uni.navigateTo({
                url: route.fullPath,
                complete,
                success,
                fail
            })
        }
    }
    replace(location, complete, fail, success) {
        uni.redirectTo({
            url: this._routeFormat(location).fullPath,
            complete,
            success,
            fail
        })
    }
    back() {
        this.go()
    }
    go(delta = 1) {
        uni.navigateBack({ delta })
    }
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$Route', { get: () => this.$Route })
        Vue.prototype.$Router = this
    }
}