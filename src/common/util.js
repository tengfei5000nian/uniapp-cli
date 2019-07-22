export const dateMsec = {
    y: 365 * 24 * 60 * 60 * 1000,
    m: 30 * 24 * 60 * 60 * 1000,
    a: 7 * 24 * 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    i: 60 * 1000,
    s: 1000
}

export function integerFixed(integer, length) {
    const max = Math.pow(10, length)
    integer = parseInt(integer)
    return integer < max ? (integer / max).toFixed(length).slice(-length) : max - 1
}

export function dateObject(date, correct = true) {
    if (date instanceof Date) {
        return date
    } else if (typeof date === 'number') {
        const length = date.toString().length
        if (length === 13) {
            return new Date(date)
        } else if (length === 10) {
            return new Date(date * 1000)
        }
    } else if (typeof date === 'string') {
        let parse = Date.parse(date)
        if (isNaN(parse) && /^\d+$/.test(date)) parse = parseInt(date)
        if (isNaN(parse)) {
            const re = /^(\d{4})[^\d]*(\d{2})[^\d]*(\d{2})[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{3})?[^\d]*$/
            if (re.test(date)) return new Date(...date.match(re).slice(1, 8).filter(val => val))
        } else {
            return dateObject(parse)
        }
    }
    return correct ? new Date() : false
}

export function dateFormat(date, format = '{yyyy}-{mm}-{dd} {hh}:{ii}') {
    date = dateObject(date)
    const dateOptions = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        a: date.getDay(),
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds()
    }
    return format.replace(/{((n|y|x|m|a|d|h|i|s)+)}/g, (result, key, keyFirst) => {
        const value = dateOptions[keyFirst] || 0
        if (keyFirst === 'n') {
            return ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'][dateOptions.y % 12]
        } else if (keyFirst === 'x') {
            return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(dateOptions.m * 2 - (dateOptions.d < [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22][dateOptions.m - 1] ? 2 : 0), 2)
        } else if (keyFirst === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        } else {
            return integerFixed(value, key.length)
        }
    })
}

export function dateParse(date, max, format = '{yyyy}年{mm}月{dd}日') {
    let diff = new Date().getTime() - dateObject(date).getTime()
    diff = diff > 0 ? diff : 0
    const isMaxFormat = () => dateMsec[max] ? diff < dateMsec[max]: true
    if (isMaxFormat() && diff < dateMsec.i) {
        return '刚刚'
    } else if (isMaxFormat() && diff < dateMsec.h) {
        return Math.floor(diff / dateMsec.i) + '分钟前'
    } else if (isMaxFormat() && diff < dateMsec.d) {
        return Math.floor(diff / dateMsec.h) + '小时前'
    } else if (isMaxFormat() && diff < dateMsec.a) {
        return Math.floor(diff / dateMsec.d) + '天前'
    } else if (isMaxFormat() && diff < dateMsec.m) {
        return Math.floor(diff / dateMsec.a) + '周前'
    } else if (isMaxFormat() && diff < dateMsec.y) {
        return Math.floor(diff / dateMsec.m) + '个月前'
    } else if (isMaxFormat()) {
        return Math.floor(diff / dateMsec.y) + '年前'
    } else {
        return dateFormat(date, format)
    }
}

export function dateMsecObject(msec = 0, format = ['h', 'i', 's']) {
    const date = {}
    msec = Math.abs(msec)
    ['y', 'm', 'a', 'd', 'h', 'i', 's'].forEach(key => {
        if (format.includes(key)) {
            date[key] = Math.floor(msec / dateMsec[key])
            msec = msec % dateMsec[key]
        }
    })
    return date
}

export function dateMsecFormat(msec = 0, format = '{hh}:{ii}:{ss}') {
    const msecObject = dateMsecObject(msec, ['y', 'm', 'a', 'd', 'h', 'i', 's'].filter(key => ~format.indexOf(key)))
    return format.replace(/{(y|m|a|d|h|i|s|)+}/g, (result, key) => {
        return integerFixed(msecObject[key.charAt(0)], key.length)
    })
}

export function queryStringify(params, filter = []) {
    params = JSON.parse(JSON.stringify(params))
    const query = params.query || ''
    filter.concat(['query']).forEach(key => {
        if (params[key]) delete params[key]
    })
    return JSON.stringify(params).replace(/\"\:/g, '=').replace(/\,\"/g, '&').replace(/\"|\{|\}/g, '') + (query && Object.keys(params).length ? '&' : '') + query
}

export function queryParse(params) {
    try {
        return JSON.parse(('{"' + params.replace(/\=/g, '":"').replace(/\&/g, '","') + '"}').replace(/\"(true|false|null)\"/g, '$1').replace(/\"(\d|[1-9]\d+)\"/g, '$1').replace(/\,?\"[^\"]+\"\:\"(undefined)?\"\,?/g, ''))
    } catch (error) {
        return {}
    }
}

export function valueRadio(value, options = [], failReturn = {}) {
    return options.find(option => option.value === value) || (typeof failReturn === 'number' ? options[failReturn] : failReturn)
}

export function valueCheckbox(values = [], options = []) {
    return options.filter(option => values.includes(option.value))
}

export function cloneObject(oj = {}) {
    return JSON.parse(JSON.stringify(oj))
}

export const promiseMerge =  new class {
    _premise = {}
    constructor() {
        const self = this
        return function (key, premiseReturn) {
            if (!self._premise[key]) self._premise[key] = premiseReturn().finally(() => {
                delete self._premise[key]
            })
            return new Promise((resolve, reject) => {
                self._premise[key].then(resolve).catch(reject)
            })
        }
    }
}
