import { pages } from '@/common/vue.expand'

export default {
    mixins: [pages],
    methods: {
        onShareAppMessage(config, e) {
            return {
                title: '你坑爹吗？',
                path: '/packages/nkdm/index/index'
            }
        }
    }
}