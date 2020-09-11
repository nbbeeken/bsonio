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

/**
 * @param {Uint8Array} sequence binary
 */
export function parse(sequence) {
    const bsonDocument = new Map()

    const view = new DataView(sequence.buffer)
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
            case TYPE_DOUBLE: {
                readable = false
                break
            }
            case TYPE_STRING: {
                value = view.getFloat64(index, true)
                index += 8
                break
            }
            case TYPE_STRING: {
                let stringLength = view.getInt32(index, true)
                index += 4
                value = getString(sequence, index, stringLength)
                index += stringLength
                break
            }
            case TYPE_DOCUMENT: {
                break
            }
            case TYPE_ARRAY: {
                break
            }
            case TYPE_BINARY: {
                break
            }
            case TYPE_UNDEFINED: {
                value = undefined
                break
            }
            case TYPE_OBJECTID: {
                break
            }
            case TYPE_BOOLEAN: {
                value = !!view.getUint8(index)
                index + 1
                break
            }
            case TYPE_UTC_DATE: {
                break
            }
            case TYPE_NULL: {
                value = null
                break
            }
            case 0x0B: {
                break
            }
            case 0x0C: {
                break
            }
            case 0x0D: {
                break
            }
            case 0x0E: {
                break
            }
            case 0x0F: {
                break
            }
            case 0x10: {
                break
            }
            case 0x11: {
                break
            }
            case 0x12: {
                break
            }
            case 0x13: {
                break
            }
            case 0xFF: {
                break
            }
            case 0x7F: {
                break
            }
            default:
                throw new Error(`Unsupported type 0x${type.toString(16)}`)
        }
        bsonDocument.set(key, { type, value })
    }
    return bsonDocument
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
    return utfDecoder.decode(sequence.slice(index, index + size - 1))
}
