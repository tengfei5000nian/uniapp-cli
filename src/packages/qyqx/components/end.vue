<template>
	<me-modal ref="meModal">
		<view v-if="status === true" class="end success">
			<view class="cover">
				<image src="https://cdn.feesource.xyz/bgzb/qyqx/success.png"></image>
			</view>
			<button class="btn" @click="to()">
				<image class="size-max" src="https://cdn.feesource.xyz/bgzb/qyqx/btn_success.png"></image>
			</button>
		</view>
		<view v-else-if="status === false" class="end fail">
			<view class="cover">
				<image src="https://cdn.feesource.xyz/bgzb/qyqx/fail.png"></image>
			</view>
			<button class="btn" @click="close()">
				<image class="size-max" src="https://cdn.feesource.xyz/bgzb/qyqx/btn_fail.png"></image>
			</button>
		</view>
	</me-modal>
</template>

<script>
	import meModal from '@/components/meModal'
	
	export default {
		components: {
			meModal
		},
		data() {
			return {
				status: null
			}
		},
		methods: {
			open(status) {
				this.status = status
				this.$refs.meModal.open()
			},
			close() {
				this.$refs.meModal.close(() => {
					this.status = null
					this.$emit('close')
				})
			},
			to() {
				this.close()
				this.$Router.push('/packages/qyqx/cover/index')
			}
		}
	}
</script>

<style lang="scss">
	.end{
		display: flex;
		flex-direction: column;
		align-items: center;
		.cover{
			width: 638upx;
			height: 643upx;
			>image{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		.btn{
			width: 435upx;
			height: 187upx;
            margin-top: 180upx;
		}
	}
</style>
