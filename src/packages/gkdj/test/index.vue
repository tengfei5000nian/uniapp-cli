<template>
	<view class="container">
        <me-head bar-color="#fd5c51" home-src="/static/main/home_white.png" back-src="/static/main/back_white.png"></me-head>
		<view class="me-body">
            <view class="incite">端正考风，严肃考纪！<br/>振奋精神，考出水平！</view>
            <view class="gk-block top-radius">
            	<view class="main">
            		<view class="subject">
            			<view>问题:</view>
            			<view>{{ subject }}</view>
            		</view>
            		<view v-for="(item, index) in answer" :key="index" :class="{checked: index === answerIndex}" class="answer" @tap="checked(index)">
            			<view></view>
            			<view>{{ item }}</view>
            		</view>
            	</view>
            	<view class="footer">
            		<button v-if="subjectIndex < maxSubjectSum" class="btn gk-style-red hover" @click="next()">下一题</button>
            		<button v-else class="btn gk-style-red hover" @click="$Router.replace('/packages/gkdj/result/index')">看成绩单</button>
            		<view>总共三题，答完查看录取通知书哦~</view>
            	</view>
            </view>
        </view>
	</view>
</template>

<script>
	import '../style.scss'
    
    import pages from '../pages.js'
    
    import meHead from '@/components/meHead'
	 
	const selfData = [
		{ subject: '今年高考什么时间？', answer: [['6.1-6.2', '6.7-6.8', '7.7-7.8'], ['6.7-6.8', '6.17-6.18', '6.27-6.28'], ['6.5-6.6', '6.9-6.10', '6.7-6.8']] },
		{ subject: '心仪的大学？', answer: [['国之重器——北大', '理科圣地——清华', '挖掘机哪家强——蓝翔'], ['滨海之花——厦大', '东南名校——南大', '厨师殿堂——新东方'], ['西南学府——川大', '浪漫樱花——武大', '汽修之家——万通']] },
		{ subject: '高考注意事项？', answer: [['不带准考证', '纸条身上藏', '使用碳素笔'], ['考场带手机', '高考不用笔', '使用2B铅'], ['撕毁条形码', '携带身份证', '考试瞎溜达']] }
	]
	
	export default {
		mixins: [pages],
        components: {
            meHead
        },
		data() {
			return {
				maxSubjectSum: selfData.length - 1,
				subjectIndex: 0,
				answerIndex: 0,
				subject: '',
				answer: []
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.subjectIndex = 0
			this.next(0)
		},
		methods: {
            checked(index) {
                this.answerIndex = index
            },
			next(step = 1) {
				this.subjectIndex += step
				this.answerIndex = 0
				this.subject = selfData[this.subjectIndex].subject
				this.answer = selfData[this.subjectIndex].answer[Math.floor(selfData[this.subjectIndex].answer.length * Math.random())]
			}
		}
	}
</script>

<style lang="scss">
    .me-body{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #fd5c51;
    }
	.incite{
		flex-shrink: 0;
		flex-grow: 0;
		height: 340upx;
		box-sizing: border-box;
		padding-top: 70upx;
		line-height: 54upx;
		text-align: center;
		font-weight: bold;
		font-size: 36upx;
		color: #fff;
	}
	.gk-block{
		flex-shrink: 1;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.main{
		padding: 0 48upx;
	}
	.subject, .answer{
		display: flex;
		justify-content: space-between;
		>view{
			&:first-child{
				flex-shrink: 0;
				flex-grow: 0;
			}
			&:last-child{
				flex-shrink: 1;
				flex-grow: 1;
				text-align: justify;
			}
		}
	}
	.subject{
		padding: 80upx 0 20upx;
		>view{
			font-weight: bold;
			&:first-child{
				margin-right: 25upx;
				line-height: 2.55em;
				font-size: 26upx;
				color: #999;
			}
			&:last-child{
				line-height: 1.2em;
				font-size: 42upx;
				color: #2b2e2d;
			}
		}
	}
	.answer{
		padding: 30upx 0;
		overflow: hidden;
		>view{
			&:first-child{
				width: 36upx;
				height: 36upx;
				margin: 7upx 40upx 0 20upx;
				border-radius: 50%;
				background-color: #999;
			}
			&:last-child{
				line-height: 50upx;
				font-weight: bold;
				font-size: 30upx;
				color: #666;
			}
		}
		&.checked{
			>view{
				&:first-child{
					background-color: #fd5c51;
				}
			}
		}
	}
	.footer{
		padding: 60upx 48upx;
		>view{
			margin-top: 45upx;
			line-height: 1.2em;
			text-align: center;
			font-weight: bold;
			font-size: 24upx;
			color: #999;
		}
	}
</style>
