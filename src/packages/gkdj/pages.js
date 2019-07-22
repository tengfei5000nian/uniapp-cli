import { pages } from '@/common/vue.expand'

export default {
    mixins: [pages],
    methods: {
        onShareAppMessage(config, e) {
            const shareTitle = this.shareTitle
            return {
                title: typeof shareTitle === 'function' ? shareTitle() : '高考大吉，榜上有名！',
                path: '/packages/nkdm/index/index'
            }
        }
    }
}