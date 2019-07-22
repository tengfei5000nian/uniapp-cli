import { Router } from '@/common/uniapp.expand'

export default new class {
	constructor() {
		const verify = type => {
			return this._type(Router.$Route.vm, type)
		}
		verify.install = this.install.bind(this)
		return verify
	}
	_verify(verifyType, currentType) {
		return verifyType ? verifyType === currentType : currentType
	}
	_type(vm, type) {
		if (vm.mpType) {
			return this._verify(type, vm.mpType)
		} else if ((vm.$options || {}).mpType) {
			return this._verify(type, vm.$options.mpType)
		} else if ((vm.$mp || {}).mpType) {
			return this._verify(type, 'body')
		} else {
			return this._verify(type, 'component')
		}
	}
	install(Vue) {
		const self = this
		Vue.prototype.$Type = function(type) {
			return self._type(this, type)
		}
	}
}