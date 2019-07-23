import { Message } from '@/common/uniapp.expand'

export function copyText (text) {
  typeof text === 'string' && text.length ? uni.setClipboardData({
    data: text,
    complete: res => {
      /ok/.test(res.errMsg) ? Message.toast.show('复制成功') : Message.toast.show('复制失败')
    }
  }) : Message.toast.show('复制失败，未获取到文本内容')
}

export function showImg (src, message = '图片展示失败') {
  src ? uni.previewImage({
    current: 0,
    urls: Array.isArray(src) ? src : [src],
    fail: res => {
      Message.toast.show(message)
    }
  }) : Message.toast.show(message)
}

export function loadImg (src) {
    return new Promise((resolve, reject) => {
        if (/^data/.test(src)) {
            const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(src) || []
            const filePath = `${wx.env.USER_DATA_PATH}/tmp_base64_img.${format}`
            uni.getFileSystemManager().writeFile({
                filePath,
                data: uni.base64ToArrayBuffer(bodyData),
                encoding: 'binary',
                complete: res => {
                    /ok/.test(res.errMsg) ? resolve(filePath) : reject({
                        message: '图片临时存储失败'
                    })
                }
            })
        } else if (/^https?/.test(src)) {
            uni.getImageInfo({
                src: src,
                complete: res => {
                    /ok/.test(res.errMsg) ? resolve(res.path) : reject({
                        message: '图片缓存失败'
                    })
                }
            })
        } else {
            reject({
                message: '图片地址错误'
            })
        }
    })
}
