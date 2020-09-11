//@ts-check

const TYPE_DOUBLE = 0x01
const TYPE_STRING = 0x02
const TYPE_DOCUMENT = 0x03
const TYPE_ARRAY = 0x04
const TYPE_BINARY = 0x05
const TYPE_UNDEFINED = 0x06
const TYPE_OBJECTID = 0x07
const TYPE_BOOLEAN = 0x08
const TYPE_UTC_DATE = 0x09
const TYPE_NULL = 0x0A
const TYPE_REGEX = 0x0B
const TYPE_DB_POINTER = 0x0C
const TYPE_CODE = 0x0D
const TYPE_SYMBOL = 0x0E
const TYPE_CODE_WITH_SCOPE = 0x0F
const TYPE_INT32 = 0x10
const TYPE_TIMESTAMP = 0x11
const TYPE_INT64 = 0x12
const TYPE_DECIMAL128 = 0x13
const TYPE_MIN_KEY = 0xFF
const TYPE_MAX_KEY = 0x7F

/** @param {Uint8Array} sequence binary */
export function consume(sequence, offset = 0) {
    const bsonDocument = new Map()

    const view = new DataView(sequence.buffer, offset)
    let index = 0

    const documentSize = view.getInt32(index, true)
    index += 4

    let readable = true
    while (readable && index < documentSize) {

        const type = view.getInt8(index)
        index += 1

        if (index === documentSize) {
            if (type !== 0) {
                throw new Error('No Document null terminator')
            }
            break
        }

        const { cString: key, size: keySize } = getCString(sequence, index)
        index += keySize

        let value
        switch (type) {
            case 0x00:
                readable = false
                break
            case TYPE_DOUBLE:
                value = view.getFloat64(index, true)
                index += 8
                break
            case TYPE_STRING: {
                const stringLength = view.getInt32(index, true)
                index += 4
                value = getString(sequence, index, stringLength)
                index += stringLength
                break
            }
            case TYPE_DOCUMENT: {
                const { bsonDocument: v, documentSize: embedSize } = consume(sequence.subarray(index), index)
                index += embedSize
                value = v
                break
            }
            case TYPE_ARRAY: {
                const { bsonDocument: v, documentSize: embedSize } = consume(sequence.subarray(index), index)
                index += embedSize
                value = mapToArray(v)
                break
            }
            case TYPE_BINARY: {
                break
            }
            case TYPE_UNDEFINED:
                value = undefined
                break
            case TYPE_OBJECTID: {
                value = sequence.subarray(index, index + 12)
                index += 12
                break
            }
            case TYPE_BOOLEAN:
                value = !!view.getUint8(index)
                index + 1
                break
            case TYPE_INT64:
            case TYPE_UTC_DATE:
                value = view.getBigInt64(index, true)
                index += 8
                break
            case TYPE_NULL: {
                value = null
                break
            }
            case TYPE_REGEX: {
                break
            }
            case TYPE_DB_POINTER: {
                break
            }
            case TYPE_CODE: {
                break
            }
            case TYPE_SYMBOL: {
                break
            }
            case TYPE_CODE_WITH_SCOPE: {
                break
            }
            case TYPE_INT32: {
                value = view.getInt32(index, true)
                index += 4
                break
            }
            case TYPE_TIMESTAMP: {
                value = view.getBigUint64(index, true)
                index += 8
                break
            }
            case TYPE_DECIMAL128: {
                break
            }
            case TYPE_MIN_KEY: {
                break
            }
            case TYPE_MAX_KEY: {
                break
            }
            default:
                throw new Error(`Unsupported type 0x${type.toString(16)}`)
        }
        bsonDocument.set(key, value)
    }
    return {bsonDocument, documentSize}
}

const utfDecoder = new TextDecoder('utf8', { fatal: true })
/**
 *
 * @param {ArrayBuffer} sequence
 * @param {number} index
 */
function getCString(sequence, index) {
    let nullTerm
    for (nullTerm = index; nullTerm < 256; nullTerm++) {
        if (sequence[nullTerm] === 0) break
    }

    const cString = utfDecoder.decode(sequence.slice(index, nullTerm))

    return { cString, size: (nullTerm - index) + 1 }
}

/**
 * @param {Uint8Array} sequence
 * @param {number} index
 * @param {number} size
 */
function getString(sequence, index, size) {
    return utfDecoder.decode(sequence.subarray(index, index + size - 1))
}

/** @param {Map<string, any>} map */
function mapToArray(map) {
    const list = []
    for (const [key, value] of map.entries()) {
        list[+key] = value
    }
    return list
}
