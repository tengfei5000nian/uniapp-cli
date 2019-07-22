<template>
    <navigator v-if="item.appid" class="box-clear" :class="className" target="miniProgram" :app-id="item.appid" :path="item.path" @fail="showCode(item, $event)">
        <slot></slot>
    </navigator>
    <button v-else-if="item.code" class="box-clear" :class="className" @tap="showCode(item)">
        <slot></slot>
    </button>
    <navigator v-else class="box-clear" :class="className" :url="item.url" @fail="toast(item, $event)">
        <slot></slot>
    </navigator>
</template>

<script>
    import { showImg } from '@/common'
    
    export default {
        props: {
            to: {
                type: [String, Object, Boolean],
                default: ''
            },
            className: {
                type: [String, Array],
                default: ''
            }
        },
        computed: {
            item() {
                const to = this.to
                if (typeof to === 'string') {
                    return { url: to }
                } else if (to instanceof Object) {
                    return to
                } else {
                    return { appid: 'null' }
                }
            }
        },
        methods: {
            showCode(item, e) {
                showImg(item.code, '打开失败')
            },
            toast(item, e) {
                this.$Toast.show('跳转失败')
            }
        }
    }
</script>
