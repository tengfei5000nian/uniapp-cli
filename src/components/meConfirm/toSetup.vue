<template>
	<me-confirm ref="meConfirm" @confirm="to"></me-confirm>
</template>

<script>
    import meConfirm from '@/components/meConfirm'

	export default {
        components: {
            meConfirm
        },
        methods: {
            open(message) {
                this.$refs.meConfirm.open({
                    title: '提示',
                    message: message || '',
                    btnValue: '前往设置',
                    btnEvent: 'confirm'
                })
            },
            to() {
                this.$refs.meConfirm.close()
                uni.openSetting({
                    complete: res => {
                        /ok/.test(res.errMsg) || this.$Toast.show('前往“设置”失败，请手动前往！')
                    }
                })
            }
        }
	}
</script>
