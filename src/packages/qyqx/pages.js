import { pages } from '@/common/vue.expand'

export default {
    mixins: [pages],
    methods: {
        onShareAppMessage(config, e) {
            const shareTitle = this.shareTitle
            return {
                title: typeof shareTitle === 'function' ? shareTitle() : '千与千寻！快看你是哪种性格。',
                path: '/packages/qyqx/index/index'
            }
        }
    }
}