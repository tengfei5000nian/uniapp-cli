<template>
    <view class="container">
        <me-head title-text="坑坑（在线）" bar-color="#fff"></me-head>
        <view class="me-body">
            <scroll-view :scroll-y="true" :scroll-with-animation="true" :scroll-into-view="lowerId" class="scroll" @scrolltolower="toLowerAfter">
                <view class="scroll-box">
                    <view v-for="(row, rowIndex) in rows" :key="rowIndex" :class="{ visible: row.visible }" class="row">
                        <template v-for="(item, itemIndex) in row.items">
                            <button v-if="item.type === 'btn'" :key="itemIndex" class="btn brown hover" @click="rowBtnTap(item.method)">
                                <image class="size-max" :src="item.src"></image>
                            </button>
                            <view v-else-if="item.type === 'info'" :key="itemIndex" :class="item.me ? 'right' : 'left'" class="info-item">
                                <image class="logo" :src="item.logo"></image>
                                <view class="text">
                                    <view class="info-icon midden top">
                                        <image class="size-max" src="https://cdn.feesource.xyz/bgzb/nkdm/info_box_midden_top.png"></image>
                                    </view>
                                    <view class="info-icon midden bottom">
                                        <image class="size-max" src="https://cdn.feesource.xyz/bgzb/nkdm/info_box_midden_bottom.png"></image>
                                    </view>
                                    <view class="info-icon center left">
                                        <image class="size-max" src="https://cdn.feesource.xyz/bgzb/nkdm/info_box_center_left.png"></image>
                                    </view>
                                    <view class="info-icon center right">
                                        <image class="size-max" src="https://cdn.feesource.xyz/bgzb/nkdm/info_box_center_right.png"></image>
                                    </view>
                                    <image class="info-icon left top" src="https://cdn.feesource.xyz/bgzb/nkdm/info_box_left_top.png"></image>
                                    <image class="info-icon left bottom" src="https://cdn.feesource.xyz/bgzb/nkdm/info_box_left_bottom.png"></image>
                                    <image class="info-icon right top" src="https://cdn.feesource.xyz/bgzb/nkdm/info_box_right_top.png"></image>
                                    <image class="info-icon right bottom" src="https://cdn.feesource.xyz/bgzb/nkdm/info_box_right_bottom.png"></image>
                                    <view class="box">{{ item.text }}</view>
                                </view>
                            </view>
                        </template>
                    </view>
                </view>
                <view id="lower"></view>
            </scroll-view>
        </view>
        <view :class="{ disabled: !allow }" class="footer">
            <button v-for="(radio, index) in radios" :key="index" class="btn resize hover" @click="answerSubject(radio.value)">{{ radio.name }}</button>
        </view>
    </view>
</template>

<script>
    import pages from '../pages.js'
    
    import meHead from '@/components/meHead'

    const selfData = {
        youLogo: 'https://cdn.feesource.xyz/bgzb/nkdm/kk_logo.png',
        meLogo: 'https://cdn.feesource.xyz/bgzb/gkdj/user_logo.jpg',
        subjects: {
            '1.0': {
                title: '你在学校犯了错，老师让你叫你爸爸来，你会...',
                answers: [
                    { value: 'A', name: 'A、打电话给爸爸，让他来', next: '1.5', num: 10, remark: '你很会尊重别人。' },
                    { value: 'B', name: 'B、跟老师软磨硬泡，主动承认错误，请求原谅', next: '2.0', num: 20, remark: '你机灵，有点小聪明 ，善于社交。' }
                ]
            },
            '1.5': {
                title: '你给爸爸打电话告诉他情况,爸爸会...',
                answers: [
                    { value: 'A', name: 'A、爸爸马上赶到学校', next: '2.0', num: 10, remark: '你爸爸很爱你，关心你的所有情况。虽然你有时候会坑他。' },
                    { value: 'B', name: 'B、爸爸不愿意来', next: '2.0', num: 20, remark: '你爸爸很爱你，虽然可能有时候方式不太对。' }
                ]
            },
            '2.0': {
                title: '你中考不理想，爸爸想尽办法让你进入一所不错的高中。',
                answers: [
                    { value: 'A', name: 'A、好好学习，要对得起爸爸', next: '2.5', num: 0, remark: '你很有责任心，跟爸爸关系应该很好。' },
                    { value: 'B', name: 'B、还是和以前一样，觉得人还是要干自己喜欢的事', next: '3.0', num: 20, remark: '你一直有着一颗叛逆的心。' }
                ]
            },
            '2.5': {
                title: '你考试成绩不是很理想回家告诉爸爸，爸爸会...',
                answers: [
                    { value: 'A', name: 'A、很生气的收拾你一顿', next: '3.0', num: 10, remark: '俗话说严父，爸爸有时候只是恨铁不成钢，但他还是爱你的。' },
                    { value: 'B', name: 'B、心平气和的跟你说尽力就好', next: '3.0', num: 20, remark: '爸爸很爱你，在乎你的情绪，不希望给你太大压力。' }
                ]
            },
            '3.0': {
                title: '你知道爸爸生日吗？',
                answers: [
                    { value: 'A', name: 'A、知道', next: 'end', num: 10, remark: '记得爸爸生日说明你是个孝顺的孩子，当然，或许你只是记性好。' },
                    { value: 'B', name: 'B、不知道', next: 'end', num: 20, remark: '你对爸爸可能不够重视，有空多陪陪他。' }
                ]
            }
        },
        subjectLog: [],
        subjectCurrent: null,
        scrollTime: 0
    }
    
    export default {
        mixins: [pages],
        components: {
            meHead
        },
        data() {
            return {
                lowerId: 'lower',
                radios: [
                    { value: 'A', name: '选择A' },
                    { value: 'B', name: '选择B' }
                ],
                rows: [],
                allow: false
            }
        },
        onLoad() {
            this.onStart()
        },
        onUnload() {
            this.onReset()
        },
        methods: {
            rowBtnTap(method) {
                switch(method) {
                    case 'resetCreate':
                        this.onReset(['start'])
                        this.createSubject('1.0')
                        break
                    case 'createRemark':
                        let num = 0
                        let remark = ''
                        selfData.subjectLog.forEach(answer => {
                            num += answer.num
                            remark += answer.remark
                        })
                        this.$Storage.set('#createRemark', { num, remark }, 1)
                        this.$Router.push('/packages/nkdm/cover/index')
                        break
                }
            },
            onReset(skipId = []) {
                this.rows = this.rows.filter(row => {
                    return skipId.includes(row.id)
                })
                this.allow = false
                selfData.subjectLog = []
                selfData.subjectCurrent = null
            },
            onStart() {
                this.rowPush([
                    { type: 'info', me: false, logo: selfData.youLogo, text: '想知道你坑爹吗，快来测测你的坑爹指数吧！' },
                    { type: 'btn', src: 'https://cdn.feesource.xyz/bgzb/nkdm/btn_cs.png', method: 'resetCreate' }
                ], 'start')
            },
            onEnd() {
                this.rowPush([
                    { type: 'info', me: false, logo: selfData.youLogo, text: '是否生成结果......' },
                    { type: 'btn', src: 'https://cdn.feesource.xyz/bgzb/nkdm/btn_sc.png', method: 'createRemark' }
                ], 'end')
            },
            createSubject(subjectKey) {
                const subject = selfData.subjects[subjectKey]
                this.rowPush([
                    { type: 'info', me: false, logo: selfData.youLogo, text: subject.title }
                ].concat(subject.answers.map(answer => {
                    return { type: 'info', me: false, logo: selfData.youLogo, text: answer.name }
                })))
                selfData.subjectCurrent = subject
            },
            answerSubject(answer) {
                this.allow = false
                if (selfData.subjectCurrent) {
                    const answerData = selfData.subjectCurrent.answers.find(row => row.value === answer) || selfData.subjectCurrent.answers[0]
                    selfData.subjectCurrent = null
                    selfData.subjectLog.push(answerData)
                    this.rowPush({
                        type: 'info',
                        me: true,
                        logo: this.$store.state.user.logo || selfData.meLogo,
                        text: answerData.value
                    })
                } else {
                    this.isNext()
                }
            },
            rowPush(items, id) {
                this.rows.push({
                    id,
                    items: Array.isArray(items) ? items : [items],
                    visible: false
                })
                this.toLowerBefore()
            },
            toLowerBefore() {
                this.lowerId = ''
                this.$nextTick(() => {
                    this.lowerId = 'lower'
                })
                selfData.scrollTime = setTimeout(() => {
                    this.toLowerAfter()
                }, 500)
            },
            toLowerAfter() {
                clearTimeout(selfData.scrollTime)
                const rows = this.rows
                for (let last = rows.length - 1; last >= 0; last--) {
                    if (rows[last].visible) {
                        break
                    } else {
                        rows[last].visible = true
                        this.isAnswer()
                    }
                }
            },
            isAnswer() {
                if (selfData.subjectCurrent) {
                    this.allow = true
                } else {
                    this.isNext()
                }
            },
            isNext() {
                const subjectLog = selfData.subjectLog
                if (subjectLog.length) {
                    const next = subjectLog[subjectLog.length - 1].next
                    if (selfData.subjects[next]) {
                        this.createSubject(next)
                    } else if (next === 'end') {
                        const rows = this.rows
                        rows.length && (rows[rows.length - 1].id === 'end' || this.onEnd())
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .me-body{
        position: relative;
        background: url(https://cdn.feesource.xyz/bgzb/nkdm/answer_bg.png) repeat center center / 21upx 21upx #fbde62;
        .scroll{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .scroll-box{
            min-height: 100%;
            box-sizing: border-box;
            padding: 45upx 30upx;
        }
        .row{
            pointer-events: none;
            opacity: 0;
            &.visible{
                pointer-events: auto;
                opacity: 1;
                transition: opacity .2s linear;
            }
            &:last-child{
                .btn.brown{
                    margin-bottom: 60upx;
                }
            }
        }
        .btn.brown{
            width: 400upx;
            height: 98upx;
            margin: 15upx auto 90upx;
        }
    }
    .footer{
        flex: 0 0 auto;
        display: flex;
        height: 100upx;
        padding-top: 1px;
        justify-content: space-between;
        align-items: stretch;
        background-color: #cacaca;
        &.disabled{
            pointer-events: none;
            .btn{
                background-color: #eee !important;
                color: #999;
            }
        }
        .btn{
            width: 100%;
            line-height: 1.2em;
            font-size: 32upx;
            color: #490b0d;
            background-color: #fff;
            &.button-hover{
                transform: scale(1);
                background-color: #eee;
            }
            & + .btn{
                margin-left: 1px;
            }
        }
    }
    .info-item{
        display: flex;
        align-items: center;
        padding: 15upx 0;
        .logo{
            flex-shrink: 0;
            flex-grow: 0;
            display: block;
            width: 80upx;
            height: 80upx;
            border-radius: 10upx;
            background-color: #fff
        }
        .text{
            position: relative;
            margin: 0 20upx;
            padding: 30upx 50upx 25upx;
        }
        .info-icon{
            position: absolute;
        }
        .box{
            position: relative;
            display: flex;
            min-width: 1.6em;
            min-height: 60upx;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            text-align: justify;
            line-height: 48upx;
            font-size: 32upx;
            color: #490b0d;
        }
        &.left{
            flex-direction: row;
            .info-icon{
                &.top{
                    top: 0;
                }
                &.right{
                    right: 0;
                }
                &.bottom{
                    bottom: 0;
                }
                &.left{
                    left: 0;
                }
                &.left.top{
                    width: 77upx;
                    height: 60upx;
                }
                &.left.bottom{
                    width: 71upx;
                    height: 63upx;
                }
                &.right.top{
                    width: 80upx;
                    height: 69upx;
                }
                &.right.bottom{
                    width: 80upx;
                    height: 59upx;
                }
                &.midden{
                    left: 68upx;
                    right: 78upx;
                    height: 60upx;
                }
                &.center{
                    top: 58upx;
                    bottom: 57upx;
                    width: 80upx;
                }
            }
        }
        &.right{
            flex-direction: row-reverse;
            .info-icon{
                &.top{
                    top: 0;
                }
                &.right{
                    left: 0;
                }
                &.bottom{
                    bottom: 0;
                }
                &.left{
                    right: 0;
                }
                &.left.top{
                    width: 77upx;
                    height: 60upx;
                    transform: rotateY(180deg);
                }
                &.left.bottom{
                    width: 71upx;
                    height: 63upx;
                    transform: rotateY(180deg);
                }
                &.right.top{
                    width: 80upx;
                    height: 69upx;
                    transform: rotateY(180deg);
                }
                &.right.bottom{
                    width: 80upx;
                    height: 59upx;
                    transform: rotateY(180deg);
                }
                &.midden{
                    left: 78upx;
                    right: 68upx;
                    height: 60upx;
                }
                &.center{
                    top: 57upx;
                    bottom: 58upx;
                    width: 80upx;
                    transform: rotateY(180deg);
                }
            }
        }
    }
</style>
