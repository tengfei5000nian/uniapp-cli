export function integerFixed(integer, length) {
    const max = Math.pow(10, length)
    integer = parseInt(integer)
    return integer < max ? (integer / max).toFixed(length).slice(-length) : max - 1
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