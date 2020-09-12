import { TYPE } from './constants'

/**
 * Read BSON Bytes and produce a map with information about the BSON.
 * @param sequence - bson bytes
 */
export function consume(sequence: Uint8Array, offset = 0) {
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
            case TYPE.DOUBLE:
                value = view.getFloat64(index, true)
                index += 8
                break
            case TYPE.STRING: {
                const stringLength = view.getInt32(index, true)
                index += 4
                value = getString(sequence, index, stringLength)
                index += stringLength
                break
            }
            case TYPE.DOCUMENT: {
                const { bsonDocument: v, documentSize: embedSize } = consume(sequence.subarray(index), index)
                index += embedSize
                value = v
                break
            }
            case TYPE.ARRAY: {
                const { bsonDocument: v, documentSize: embedSize } = consume(sequence.subarray(index), index)
                index += embedSize
                value = mapToArray(v)
                break
            }
            case TYPE.BINARY: {
                break
            }
            case TYPE.UNDEFINED:
                value = undefined
                break
            case TYPE.OBJECTID: {
                value = sequence.subarray(index, index + 12)
                index += 12
                break
            }
            case TYPE.BOOLEAN:
                value = !!view.getUint8(index)
                index + 1
                break
            case TYPE.INT64:
            case TYPE.UTC_DATE:
                value = view.getBigInt64(index, true)
                index += 8
                break
            case TYPE.NULL: {
                value = null
                break
            }
            case TYPE.REGEX: {
                break
            }
            case TYPE.DB_POINTER: {
                break
            }
            case TYPE.CODE: {
                break
            }
            case TYPE.SYMBOL: {
                break
            }
            case TYPE.CODE_WITH_SCOPE: {
                break
            }
            case TYPE.INT32: {
                value = view.getInt32(index, true)
                index += 4
                break
            }
            case TYPE.TIMESTAMP: {
                value = view.getBigUint64(index, true)
                index += 8
                break
            }
            case TYPE.DECIMAL128: {
                break
            }
            case TYPE.MIN_KEY: {
                break
            }
            case TYPE.MAX_KEY: {
                break
            }
            default:
                throw new Error(`Unsupported type 0x${type.toString(16)}`)
        }
        bsonDocument.set(key, value)
    }
    return { bsonDocument, documentSize }
}

const utfDecoder = new TextDecoder('utf8', { fatal: true })
function getCString(sequence: Uint8Array, index: number) {
    let nullTerm = index;
    for (; nullTerm < 256; nullTerm++) {
        if (sequence[nullTerm] === 0) break
    }

    const cString = utfDecoder.decode(sequence.slice(index, nullTerm))

    return { cString, size: (nullTerm - index) + 1 }
}

function getString(sequence: Uint8Array, index: number, size: number) {
    return utfDecoder.decode(sequence.subarray(index, index + size - 1))
}

function mapToArray(map: Map<string, any>) {
    const list = []
    for (const [key, value] of map.entries()) {
        list[+key] = value
    }
    return list
}
