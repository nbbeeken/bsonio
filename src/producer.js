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

const INT64_MAX = BigInt('0x7FFFFFFFFFFFFFFF')

/**
 * @typedef BSONValueDescriptor
 *  @property {number} type
 *  @property {any} value
 *  @property {number} size
 *  @property {Uint8Array} [bytes] in order to calculate the size this value had to be made into bytes, here's the results for your convenience
 */

/**
 * @param {Record<string, any>} document
 */
function convertPOJOtoMap(document) {
    const map = new Map()
    for (const [key, value] of Object.entries(document)) {
        map.set(key, bsonDescriptorFrom(value))
    }
    return map
}

/** @returns {BSONValueDescriptor} */
function bsonDescriptorFrom(value) {
    let type
    let size
    let bytes

    switch (typeof value) {
        case 'number':
            if (Number.isInteger(value)) {
                if (value < 0x7FFF_FFFF) {
                    type = TYPE_INT32
                    size = 4
                } else {
                    type = TYPE_INT64
                    size = 8
                }
            } else {
                type = TYPE_DOUBLE
                size = 8
            }
            break
        case 'string':
            type = TYPE_STRING
            bytes = encoder.encode(value + '\x00')
            size = bytes.byteLength + 4
            break
        case 'bigint':
            if (value < INT64_MAX) {
                type = TYPE_INT64
                size = 8
            } else {
                type = TYPE_DECIMAL128
                size = 16
            }
            break
        case 'boolean':
            type = TYPE_BOOLEAN
            size = 1
        case 'undefined':
            type = TYPE_UNDEFINED
            size = 0
            break
        case 'symbol':
            type = TYPE_SYMBOL
            break
        case 'function':
            type = TYPE_CODE
            break
        case 'object':
            if (value === null) {
                type = TYPE_NULL
                size = 0
            } else if (Array.isArray(value)) {
                type = TYPE_ARRAY
            } else {
                type = TYPE_DOCUMENT
            }
            break
        default: // really unexpected
            throw new Error(`Unable to handle type: ${typeof value}`)
    }

    if (type === TYPE_DOCUMENT) {
        if (value instanceof RegExp) {
            type = TYPE_REGEX
            value = { regex: value, flags: '' }
        } else if (value instanceof Date) {
            type = TYPE_UTC_DATE
        } else if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
            type = TYPE_BINARY
        } else if (Reflect.has(value, '_bsontype')) {
                switch (Reflect.get(value, '_bsontype')) {
                    case 'ObjectId':
                    case 'ObjectID':
                        type = TYPE_OBJECTID
                        break
                    case 'DBRef':
                        type = TYPE_DB_POINTER
                        break
                    case 'Code':
                        type = Reflect.has(value, 'scope') ? TYPE_CODE_WITH_SCOPE : TYPE_CODE
                        break
                    case 'Timestamp':
                        type = TYPE_TIMESTAMP
                        break
                    case 'MinKey':
                        type = TYPE_MIN_KEY
                        break
                    case 'MaxKey':
                        type = TYPE_MAX_KEY
                        break
                }

            }
    }

    if (!bytes) return { type, value, size }
    return { type, value, size, bytes }
}

const encoder = new TextEncoder()

/** @param {Map<string, {type: number, value: any, size: number}>} map */
function produce(map) {
    const documentSize = calculateSize(map)
    const array = new Uint8Array(documentSize)
    const view = new DataView(array.buffer)
    view.setInt32(0, documentSize, true)
    let index = 4

    for (const [key, descriptor] of map.entries()) {
        array[index] = descriptor.type
        index += 1
        index += writeCString(array, index, key)
        writeBSONValue(array, index, descriptor)
        index += descriptor.size
    }

    return array
}

function utf8StringLength(str) {
    return encoder.encode(str).byteLength;
}

/** @param {Map<string, BSONValueDescriptor>} map */
function calculateSize(map) {
    let documentSize = 5
    for (const [key, value] of map.entries()) {
        documentSize += utf8StringLength(key) + 1 // null terminator
        documentSize += 1 // type indicator
        documentSize += value.size
    }
    return documentSize
}

function writeCString(buffer, index, cString) {
    const keyAsBytes = encoder.encode(cString)
    buffer.set(keyAsBytes, index)
    buffer.set([0], index + keyAsBytes.length + 1)
    return keyAsBytes.length + 1
}

/**
 *
 * @param {Uint8Array} array
 * @param {number} index
 * @param {BSONValueDescriptor} descriptor
 */
function writeBSONValue(array, index, descriptor) {
    const view = new DataView(array.buffer)
    switch (descriptor.type) {
        case TYPE_DOUBLE:
            view.setFloat64(index, descriptor.value, true)
            break
        case TYPE_STRING:
            view.setInt32(index, descriptor.bytes.byteLength, true)
            index += 4
            array.set(descriptor.bytes, index)
            break
        case TYPE_INT64:
            view.setBigInt64(index, descriptor.value, true)
        default:
            break
    }
}

module.exports = {
    convertPOJOtoMap,
    produce,
    calculateSize,
}
