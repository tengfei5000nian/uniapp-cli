import Logic from '@/common/uniapp.expand/logic'
import Storage from '@/common/uniapp.expand/storage'
import Message from '@/common/uniapp.expand/message'
import Router from '@/common/uniapp.expand/router'
import Type from '@/common/uniapp.expand/type'

export {
    Logic,
	Storage,
	Message,
	Router,
	Type
}

export default {
	install(Vue) {
        Logic.install(Vue)
		Storage.install(Vue)
		Message.install(Vue)
		Router.install(Vue)
		Type.install(Vue)
	}
}