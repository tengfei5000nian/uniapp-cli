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