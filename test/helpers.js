
function toHexString(bytes) {
    let s
    if(Buffer.isBuffer(bytes)) {
        s = bytes.toString('hex').toUpperCase()
    } else {
        s = bytes.toString().split(',')
        .map(v => (+v).toString(16).toUpperCase())
        .map(v => v.length === 1 ? '0' + v : v)
        .join(' ')
    }
    return s
}

module.exports = { toHexString }
