export default new class {
	constructor() {
		this.toast = {
			show: this._toastShow,
			hide: this._toastHide
		}
		this.loading = {
			show: this._loadingShow,
			hide: this._loadingHide
		}
	}
	_loadingCount = 0
	_toastShow(config = {}) {
		return new Promise(resolve => {
			const defaultConfig = {
				icon: 'none',
				mask: true,
				duration: 1500,
				...(typeof config === 'string' ? { title: config } : config)
			}
			this._loadingCount && this._loadingHide(true)
			uni.showToast(defaultConfig)
			defaultConfig.closeSend && setTimeout(() => resolve(), defaultConfig.duration)
		})
	}
	_toastHide() {
		uni.hideToast()
	}
	_loadingShow(config = {}) {
		const defaultConfig = {
			title: '请求中',
			mask: true,
			...(typeof config === 'string' ? { title: config } : config)
		}
		defaultConfig.newSend && this._loadingHide(true)
		this._loadingCount || uni.showLoading(defaultConfig)
		this._loadingCount++
	}
	_loadingHide(force = false) {
		if (!force && this._loadingCount) {
			this._loadingCount--
		} else {
			this._loadingCount = 0
			uni.hideLoading()
		}
	}
	install(Vue) {
		Vue.prototype.$Toast = this.toast
		Vue.prototype.$Loading = this.loading
	}
}