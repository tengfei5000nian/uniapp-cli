import { dateFormat } from '@/common/util'

export function idFormat(id){
	const abc = 'abcdefghijklmnopqrstuvwxyz'
	return id.toLowerCase().replace(/[^0-9a-z]/, '').split('').map(text => {
		return /^\d+$/.test(text) ? text : Math.abs(abc.indexOf(text))
	}).join('')
}

export function certificateFormat(user = {}){
	const idNum = idFormat(user.id)
	return {
		title: dateFormat(new Date(), '{yyyy}普通高等学校招生全国统一考试'),
		logo: user.logo || 'https://cdn.feesource.xyz/bgzb/gkdj/user_logo.jpg',
		id: idNum.slice(0, 6),
		name: user.name || '未知',
		sex: user.sex,
		age: [17, 18, 19][idNum.slice(-1) % 3] + '岁'
	}
}

export function examData(reset = false) {
	let data = null
	if (!reset) {
		data = wx.getStorageSync('examData')
		if (data instanceof Object) return data
	}
	const examBase = ['语文', '数学', '外语']
	const examSelect = {
		wk: ['文科综合', ['政治', '历史']],
		lk: ['理科综合', ['化学', '物理']]
	}
	const examSelectKey = Object.keys(examSelect)
	const type = examSelectKey[Math.floor(examSelectKey.length * Math.random())]
	const grade = () => 80 + Math.round(70 * Math.random())
	examSelect[type][1] = examSelect[type][1].map(text => {
		return [text, grade()]
	})
	data = {
		type,
		examBase: examBase.map(text => {
			return [text, grade()]
		}),
		examSelect: examSelect[type]
	}
	wx.setStorage({
		key: 'examData',
		data
	})
	return data
}

export function schoolData(type = 'lk') {
	const quotation = [
		'不求难题都做，先求中低档题不错。',
		'陪自己走下去，哪怕是弯路。',
		'只求“少丢分”，不说“得高分”！',
		'考试总会留下你不会的题。',
		'认同自己，是一件需要练习的事。',
		'试试就能行，争争就能赢。',
		'高考非难事，只要肯放弃。',
		'题，都是在你不会的时候出。',
		'将所有一言难尽，一饮而尽。',
		'四分学识智，三心细耐恒，二成应试法，一片平常心。',
		'汗水换不来同情，成绩才能博得掌声。',
		'最难的题，对你而言，并不一定在于最后一道。',
		'不求与人相比，但求超越自己。',
		'生活就像一盒巧克力，你永远不知道高考这颗有多苦。',
		'昨天是一张作废的支票，明天是一张期票，只有今天才是你唯一拥有的现金。',
		'你必须非常努力，才能看起来毫不费力。',
		'上过很多课，依然不会这一题。',
		'不是所有的分，都是可以拿的。',
		'志愿一定要填对，清华还是蓝翔，这就是个问题。',
		'要知道，就算你考上了清华，也拯救不了你未来的发量。',
		'别以为你考上了北大，你就会脱单。',
		'化学完全不需要担心，缺哪个元素就在自己身上找。',
		'搞好同学关系有多么的重要，有时候对方一个侧身甚至就能改变你的人生。',
		'考上大学的同学也不要高兴，因为四年后你会和现在一样迷茫！',
		'高考也没啥，也就决定你在哪座城市打王者荣耀，一年有多少天可以穿丝袜，回家的车票好不好买！',
		'高考真得不是我们唯一的出路，我们至少还可以选择搬砖！'
	]
	const school = {
		wk: [
			['戏精对杠精大学', 'xijingduigangjingdaxue'],
			['互相嫌弃大学', 'huxiangxianqidaxue'],
			['励志自由大学', 'lizhiziyoudaxue'],
			['封路维修美食大学', 'fengluweixiumeishidaxue'],
			['情商智商不如财商大学', 'qnshangzhishangburucaishangdaxue'],
			['恋与少年大学', 'liangyushaoniandaxue'],
			['等蛙回家大学', 'dengwahuijiadaxue'],
			['呼唤爱大学', 'huhuanaidaxue'],
			['争气六步走大学', 'zhengqiliubuzoudaxue'],
			['又双叒叕大学', 'youshuangruozhuodaxue'],
			['火炎焱燚大学', 'huoyanyanyidaxue'],
			['水沝淼㵘大学', 'shuizhuimiaomandaxue'],
			['哲理十八弯大学', 'zhelishibawangdaxue']
		],
		lk: [
			['人生巅峰大学', 'renshengdianfengdaxue'],
			['易燃易爆大学', 'yirangyibaodaxue'],
			['正确脱单大学', 'zhengquetuodandaxue'],
			['文体分家大学', 'wentifenjiadaxue'],
			['发际线管理大学', 'fajixianguanlidaxue'],
			['万有引力大学', 'wanyouyinglidaxue'],
			['上山下海大学', 'shangshangxiahaidaxue'],
			['焊板贴膜超能大学', 'hanbangtiemochaonengdaxue'],
			['代码和胫骨关系大学', 'daimahejinguguanxidaxue'],
			['别人家孩子上的大学', 'bierenjiahaizishangdedaxue'],
			['量子供给侧大学', 'liangzigongjichedaxue'],
			['宇宙中心大学', 'yuzhouzhonxindaxue'],
			['学什么火什么大学', 'xueshenmehuoshenmedaxue']
		]
	}[type]
	const schoolChecked = school[Math.floor(school.length * Math.random())]
	schoolChecked[1] = schoolChecked[1].toUpperCase()
	return {
		school: schoolChecked,
		quotation: quotation[Math.floor(quotation.length * Math.random())]
	}
}

export const code = 'https://cdn.feesource.xyz/mxzb/assets/code_miniapp.png'
