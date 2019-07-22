export default new class {
	install(Vue, options) {
		Object.defineProperty(Vue.prototype, '$Logic', {
			get(key) {
				if (this._logic) {
					return this._logic
				} else if (typeof this.$options.logic === 'function') {
					this._logic = this.$options.logic.call(this)
					return this._logic
				} else {
					return {}
				}
			}
		})
	}
}