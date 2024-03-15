export function joinTimestamp(join, fieldTime = '_t',  result, isPrefix = true) {
    if (!join) return result ? '' : {};
    const now = new Date().getTime();
    if (result) {
        return `${isPrefix ? '?' : '&'}${fieldTime}=${now}`
    }
    return { [fieldTime]: now };
}

export function setObjToUrlParams(baseUrl, obj) {
    let parameters = '';
    for (const key in obj) {
        parameters += `${key}=${encodeURIComponent(obj[key])}&`;
    }
    parameters = parameters.replace(/&$/, '');
    if (baseUrl.indexOf("?") != -1) {
        return /\&$/.test(baseUrl) ? baseUrl + parameters : `${baseUrl}&${parameters}`;
    }
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}
