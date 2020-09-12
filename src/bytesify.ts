import { TYPE } from './constants'

export const INT64_MAX = BigInt('0x7FFFFFFFFFFFFFFF')

interface BSONValueDescriptor {
    type: number,
    value: any,
    size?: number,
    /** In order to calculate the size this value had to be made into bytes, here's the results for your convenience */
    bytes?: Uint8Array
}

/**
 * Convert a Plain Javascript Object to a map with typing information.
 * @param document - a simple js object
 */
function convertPOJOtoMap(document: Record<string, any>) {
    const map = new Map()
    for (const [key, value] of Object.entries(document)) {
        map.set(key, bsonDescriptorFrom(value))
    }
    return map
}

/** Create a value descriptor that explains the BSON value. */
function bsonDescriptorFrom(value: any): BSONValueDescriptor {
    let type
    let size
    let bytes

    switch (typeof value) {
        case 'number':
            if (Number.isInteger(value)) {
                if (value < 0x7FFF_FFFF) {
                    type = TYPE.INT32
                    size = 4
                } else {
                    type = TYPE.INT64
                    size = 8
                }
            } else {
                type = TYPE.DOUBLE
                size = 8
            }
            break
        case 'string':
            type = TYPE.STRING
            bytes = encoder.encode(value + '\x00')
            size = bytes.byteLength + 4
            break
        case 'bigint':
            if (value < INT64_MAX) {
                type = TYPE.INT64
                size = 8
            } else {
                type = TYPE.DECIMAL128
                size = 16
            }
            break
        case 'boolean':
            type = TYPE.BOOLEAN
            size = 1
        case 'undefined':
            type = TYPE.UNDEFINED
            size = 0
            break
        case 'symbol':
            type = TYPE.SYMBOL
            break
        case 'function':
            type = TYPE.CODE
            break
        case 'object':
            if (value === null) {
                type = TYPE.NULL
                size = 0
            } else if (Array.isArray(value)) {
                type = TYPE.ARRAY
            } else {
                type = TYPE.DOCUMENT
            }
            break
        default: // really unexpected
            throw new Error(`Unable to handle type: ${typeof value}`)
    }

    if (type === TYPE.DOCUMENT) {
        if (value instanceof RegExp) {
            type = TYPE.REGEX
            value = { regex: value, flags: '' }
        } else if (value instanceof Date) {
            type = TYPE.UTC_DATE
        } else if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
            type = TYPE.BINARY
        } else if (Reflect.has(value, '_bsontype')) {
            switch (Reflect.get(value, '_bsontype')) {
                case 'ObjectId':
                case 'ObjectID':
                    type = TYPE.OBJECTID
                    break
                case 'DBRef':
                    type = TYPE.DB_POINTER
                    break
                case 'Code':
                    type = Reflect.has(value, 'scope') ? TYPE.CODE_WITH_SCOPE : TYPE.CODE
                    break
                case 'Timestamp':
                    type = TYPE.TIMESTAMP
                    break
                case 'MinKey':
                    type = TYPE.MIN_KEY
                    break
                case 'MaxKey':
                    type = TYPE.MAX_KEY
                    break
            }

        }
    }

    if (type === TYPE.DOCUMENT) {
        value = convertPOJOtoMap(value)
    }

    if (!bytes) return { type, value, size }
    return { type, value, size, bytes }
}

const encoder = new TextEncoder()

function bytesify(map: Map<string, { type: number, value: any, size: number }> | any) {
    if (!(map instanceof Map)) {
        map = convertPOJOtoMap(map)
    }

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

function utf8StringLength(str: string) {
    return encoder.encode(str).byteLength
}

function calculateSize(map: Map<string, BSONValueDescriptor>) {
    let documentSize = 5
    for (const [key, value] of map.entries()) {
        documentSize += utf8StringLength(key) + 1 // null terminator
        documentSize += 1 // type indicator
        documentSize += value.size!
    }
    return documentSize
}

function writeCString(buffer: Uint8Array, index: number, cString: string) {
    const keyAsBytes = encoder.encode(cString)
    buffer.set(keyAsBytes, index)
    buffer.set([0], index + keyAsBytes.length + 1)
    return keyAsBytes.length + 1
}

function writeBSONValue(array: Uint8Array, index: number, descriptor: BSONValueDescriptor) {
    const view = new DataView(array.buffer)
    switch (descriptor.type) {
        case TYPE.DOUBLE:
            view.setFloat64(index, descriptor.value, true)
            break
        case TYPE.DOCUMENT:
            view.setInt32(index, descriptor.size!, true)
            break
        case TYPE.STRING:
            view.setInt32(index, descriptor.bytes!.byteLength, true)
            index += 4
            array.set(descriptor.bytes!, index)
            break
        case TYPE.INT64:
            view.setBigInt64(index, descriptor.value, true)
        default:
            break
    }
}

export {
    convertPOJOtoMap,
    bytesify,
    calculateSize,
}
