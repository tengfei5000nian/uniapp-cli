import Store from '@/store'

export const adErrorInfo = {
  '0': '广告组件无效或缺少unit-id',
  '1000': '后端错误调用失败',
  '1001': '参数错误',
  '1002': '广告单元无效',
  '1003': '内部错误',
  '1004': '无适合的广告',
  '1005': '广告组件审核中',
  '1006': '广告组件被驳回',
  '1007': '广告组件被驳回',
  '1008': '广告单元已关闭',
  '2001': '启动一定时间内不允许展示插屏广告',
  '2002': '距离插屏广告或激励视频广告上次播放时间不足',
  '2003': '当前正在播放插屏广告或激励视频广告',
  '2004': '广告渲染失败',
  '2005': '广告调用异常'
}

export function sendEvent (config = {}) {
  if (!getApp) return
  const app = getApp()
  const user = Store.state.user
  const defaultConfig = {
    adType: '广告错误',
    ...config
  }
  app.aldstat && app.aldstat.sendEvent && app.aldstat.sendEvent(defaultConfig.adType, {
    '异常情况': `${defaultConfig.errCode || '无'}_${adErrorInfo[defaultConfig.errCode] || defaultConfig.message || '未知'}_${defaultConfig.unitId || '丢失'}_${user.id || '无'}_${user.name || '无'}`
  })
}
