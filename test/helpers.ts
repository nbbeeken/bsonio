
export function toHexString(bytes: Uint8Array) {
    return bytes.toString().split(',')
        .map(v => (+v).toString(16).toUpperCase())
        .map(v => v.length === 1 ? '0' + v : v)
        .join(' ')
}
