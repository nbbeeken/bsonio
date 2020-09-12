
export function toHexString(bytes: Uint8Array) {
    return bytes.toString().split(',')
        .map(v => (+v).toString(16).toUpperCase())
        .map(v => v.length === 1 ? '0' + v : v)
        .join(' ')
}

export function expect(condition: any) {
    const result = !!condition
    if (condition === false) {
        throw new Error('Failed expectations')
    }
    return result
}

const ENABLE_LOGGING = true

export function log(message: any) {
    if (ENABLE_LOGGING) console.log(message)
}

export function logObject(message: string, obj: any) {
    if (ENABLE_LOGGING) {
        console.log(message)
        console.dir(obj)
    }
}
