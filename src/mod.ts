//@ts-check

import { BASE64 } from "./base64.js"
import { D128 } from "./d128.js"

const checkForMath = (potentialGlobal: any) => {
    return potentialGlobal && potentialGlobal.Math == Math && potentialGlobal
}

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
export const getGlobal = () => {
    return (
        checkForMath(typeof globalThis === 'object' && globalThis) ||
        checkForMath(typeof window === 'object' && window) ||
        checkForMath(typeof self === 'object' && self) ||
        checkForMath(typeof global === 'object' && global) ||
        Function('return this')()
    )
}


const byteToHex = (byte: number): string => byte.toString(16).padStart(2, '0')
const bytesToHex = (bytes: Uint8Array): string => Array.from(bytes).map(b => byteToHex(b)).join('')

const $size = Symbol('size')
const $dv = Symbol('dataView')
const $bytes = Symbol('bytes')
const $type = Symbol('type')
const $isArray = Symbol('isArray')
export const MinKey = Symbol('MinKey')
export const MaxKey = Symbol('MaxKey')

const SIZEOF = Object.freeze({
    INT32: 4,
    INT64: 8,
    FLOAT64: 8,
    BYTE: 1,
    OID: 12,
    D128: 16,
})

const EMPTY_VALUE = new Uint8Array(Object.freeze(new ArrayBuffer(0)))

const MAX_DATE = 8640000000000000n
const MIN_DATE = -8640000000000000n
const MAX_ARRAY_INDEX = 0xFFFF_FFFF - 1

export const BT = Object.freeze({
    DOUBLE: 0x01,
    STRING: 0x02,
    DOCUMENT: 0x03,
    ARRAY: 0x04,
    BINARY: 0x05,
    UNDEFINED: 0x06,
    OID: 0x07,
    BOOLEAN: 0x08,
    DATE: 0x09,
    NULL: 0x0A,
    REGEXP: 0x0B,
    DB_POINTER: 0x0C,
    JS_CODE: 0x0D,
    SYMBOL: 0x0E,
    JS_CODE_SCOPE: 0x0F,
    INT32: 0x10,
    TIMESTAMP: 0x11,
    INT64: 0x12,
    DEC128: 0x13,
    MIN_KEY: 0xFF,
    MAX_KEY: 0x7F,
})

let DECODER: TextDecoder
if (getGlobal().TextDecoder) {
    DECODER = new TextDecoder('utf-8', { fatal: true })
} else {
    // Still supports ascii!
    DECODER = {
        decode() {
            throw new Error('Environment cannot decode utf8')
        }
    } as unknown as TextDecoder
}

const VALID_BSON_TYPE_BYTES = new Set(Object.values(BT))
const BT_LOOKUP = Object.freeze(Object.fromEntries(Object.entries(BT).map(([typeName, typeByte]) => [typeByte, typeName])))

export class BSONDataView extends DataView {
    [$bytes]: Uint8Array

    constructor(buffer: ArrayBufferLike, byteOffset: number, byteLength: number) {
        super(buffer, byteOffset, byteLength)
        this[$bytes] = new Uint8Array(buffer, byteOffset, byteLength)
    }

    subarray(begin?: number, end?: number) {
        return this[$bytes].subarray(begin, end)
    }
    getSize(offset = 0) {
        const size = this.getInt32(offset, true)
        if (size < 0) throw new Error(`Size must be positive, got ${size}`)
        return size
    }
    getCStringLength(offset = 0) {
        let nullTerminatorIndex
        for (nullTerminatorIndex = offset; this[$bytes][nullTerminatorIndex] !== 0x00; nullTerminatorIndex++);
        return nullTerminatorIndex - offset
    }
    getCStringAndSize(offset = 0): [length: number, cString: string] {
        let isASCII = true
        let size = this.getCStringLength(offset)
        const chars = new Array(size)
        for (let i = 0; i < size; i++) {
            const byte = this[$bytes][i + offset]
            if (byte > 0x7F) {
                isASCII = false
                break
            }
            chars[i] = String.fromCharCode(byte)
        }
        if (isASCII) {
            return [chars.length, chars.join('')]
        }
        const seq = this.subarray(offset, offset + size)
        return [seq.byteLength, DECODER.decode(seq)]
    }
    /** Decodes a string a view on based on the LE int32 written at the offset */
    getString(offset = 0) {
        const size = this.getSize(offset)
        const nullTerminatorIndex = offset + SIZEOF.INT32 + size - 1
        if (this[$bytes][nullTerminatorIndex] !== 0x00) {
            throw new Error(`utf8 string must end in 0x00, size=${size}`)
        }
        let isASCII = true
        const chars = new Array(size - 1)
        for (
            let byteIdx = offset + SIZEOF.INT32, charIdx = 0;
            byteIdx < nullTerminatorIndex && charIdx < chars.length;
            charIdx++, byteIdx++
        ) {
            const byte = this[$bytes][byteIdx]
            if (byte > 0x7F) {
                isASCII = false
                break
            }
            chars[charIdx] = String.fromCharCode(byte)
        }
        if (isASCII) {
            return chars.join('')
        }
        const seq = this.subarray(offset + SIZEOF.INT32, offset + SIZEOF.INT32 + size - 1)
        return DECODER.decode(seq)
    }
    /** Returns a view on based on the LE int32 written at the offset.*/
    getSizedSequence(offset = 0) {
        const size = this.getInt32(offset, true)
        const seq = this[$bytes].subarray(offset, offset + 4 + size)
        return seq
    }
    getBigUint128(offset = 0, littleEndian = false) {
        if (littleEndian) {
            const low = this.getBigUint64(0, true)
            const high = this.getBigUint64(8, true)
            return (high << 64n) | low
        } else {
            const high = this.getBigUint64(0, false)
            const low = this.getBigUint64(8, false)
            return (high << 64n) | low
        }
    }
}

export type BSONValueSettings = Record<string, any>

export class BSONValue {
    [$dv]?: BSONDataView
    bytes: Uint8Array
    type: number
    /**
     * @param {number} type BSON Type
     * @param {Uint8Array} bytes
     */
    constructor(type: number, bytes: Uint8Array) {
        this.type = type
        this.bytes = bytes
        // Symbol properties also have a performance cost, its small but we shouldn't pay it on such a hot path
        // this[$type] = type
        // this[$bytes] = bytes
        // defineProperty TANKS performance :(
        // Object.defineProperty(this, 'type', { value: type, writable: false, configurable: false, enumerable: true })
        // Object.defineProperty(this, 'bytes', { value: bytes, writable: false, configurable: false, enumerable: true })
    }

    toString() {
        return `BSONValue{ type: ${this.type}(${BT_LOOKUP[this.type]}) bytes: "${bytesToHex(this.bytes)}" }`
    }

    inspect() {
        return this.toString()
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
        return this.toString()
    }

    get dv(): BSONDataView {
        if (this[$dv] == null) {
            this[$dv] = new BSONDataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
        }
        // @ts-expect-error - TS cannot narrow the type of a symbol property
        return this[$dv]
    }

    toNative(settings: BSONValueSettings = {}): unknown {
        switch (this.type) {
            case BT.NULL: return this.asNull(settings)
            case BT.UNDEFINED: return this.asUndefined(settings)
            case BT.DOUBLE: return this.asDouble(settings)
            case BT.INT32: return this.asInt32(settings)
            case BT.TIMESTAMP: return this.asTimestamp(settings)
            case BT.INT64: return this.asBigInt64(settings)
            case BT.DEC128: return this.asDecimal128(settings)
            case BT.MIN_KEY: return this.asMinKey(settings)
            case BT.MAX_KEY: return this.asMaxKey(settings)
            case BT.JS_CODE: return this.asJavaScript(settings)
            case BT.SYMBOL: return this.asSymbol(settings)
            case BT.STRING: return this.asString(settings)
            case BT.DOCUMENT: return this.asDocument(settings)
            case BT.ARRAY: return this.asArray(settings)
            case BT.BINARY: return this.asBinary(settings)
            case BT.OID: return this.asObjectId(settings)
            case BT.BOOLEAN: return this.asBoolean(settings)
            case BT.DATE: return this.asDate(settings)
            case BT.REGEXP: return this.asRegExp(settings)
            case BT.DB_POINTER: return this.asDBPointer(settings)
            case BT.JS_CODE_SCOPE: return this.asJavaScriptWithScope(settings)
            default: throw new Error(`Unknown BSON type`)
        }
    }

    toEJSON(): string {
        const settings = { style: 'ejson' } as const
        switch (this.type) {
            case BT.NULL: return 'null'
            case BT.UNDEFINED: return '{"$undefined":true}'
            case BT.DOUBLE: {
                const double = this.asDouble(settings)
                if (Number.isInteger(double)) {
                    if (Object.is(-0, double)) {
                        return `{"$numberDouble":"-${double.toFixed(1)}"}`
                    }
                    if (double.toFixed(1).length >= 13) {
                        return `{"$numberDouble":"${double.toExponential(13).toUpperCase()}"}`;
                    }
                    return `{"$numberDouble":"${double.toFixed(1)}"}`
                }
                return `{"$numberDouble":"${double}"}`
            }
            case BT.INT32: return `{"$numberInt":"${String(this.asInt32(settings))}"}`
            case BT.TIMESTAMP: return `{"$timestamp":${JSON.stringify(this.asTimestamp(settings))}}`
            case BT.INT64: return `{"$numberLong":"${String(this.asBigInt64(settings))}"}`
            case BT.DEC128: return `{"$numberDecimal":"${D128.toString(this.bytes)}"}`
            case BT.MIN_KEY: return '{"$minKey":1}'
            case BT.MAX_KEY: return '{"$maxKey":1}'
            case BT.JS_CODE: return JSON.stringify(this.asJavaScript(settings))
            case BT.SYMBOL: return JSON.stringify(this.asSymbol(settings))
            case BT.STRING: return JSON.stringify(this.asString(settings))
            case BT.DOCUMENT: return this.asDocument(settings).toEJSON()
            case BT.ARRAY: return this.asArray(settings).toEJSON()
            case BT.BINARY: {
                const bin = this.asBinary()
                if (bin.$binary.subType === 0x02) {
                    return `{"$binary":{"base64":"${BASE64.fromByteArray(bin.$binary.base64.subarray(SIZEOF.INT32))}", "subType":"${bin.$binary.subType.toString(16).padStart(2, '0')}"}}`
                }
                return `{"$binary":{"base64":"${BASE64.fromByteArray(bin.$binary.base64)}", "subType":"${bin.$binary.subType.toString(16).padStart(2, '0')}"}}`
            }
            case BT.OID: return JSON.stringify(this.asObjectId(settings))
            case BT.BOOLEAN: return String(this.asBoolean(settings))
            case BT.DATE: return JSON.stringify(this.asDate(settings))
            case BT.REGEXP: return JSON.stringify(this.asRegExp(settings))
            case BT.DB_POINTER: return JSON.stringify(this.asDBPointer())
            case BT.JS_CODE_SCOPE: return JSON.stringify(this.asJavaScriptWithScope())
            default: throw new Error(`Unknown BSON type`)
        }
    }

    asNull(settings: BSONValueSettings = {}) {
        if (this.type !== BT.NULL) throw new Error('Cannot interpret as BSON null')
        return null
    }
    asUndefined(settings: BSONValueSettings = {}) {
        if (this.type !== BT.UNDEFINED) throw new Error('Cannot interpret as BSON undefined')
        return null
    }
    asDouble(settings: BSONValueSettings = {}) {
        if (this.type !== BT.DOUBLE) throw new Error('Cannot interpret as BSON double')
        return this.dv.getFloat64(0, true)
    }
    asInt32(settings: BSONValueSettings = {}) {
        if (this.type !== BT.INT32) throw new Error('Cannot interpret as BSON int32')
        return this.dv.getInt32(0, true)
    }
    asBigInt64(settings: BSONValueSettings = {}) {
        if (this.type !== BT.INT64) throw new Error('Cannot interpret as BSON int64')
        return this.dv.getBigInt64(0, true)
    }
    asTimestamp(settings: BSONValueSettings = {}) {
        if (this.type !== BT.TIMESTAMP) throw new Error('Cannot interpret as BSON timestamp')
        return { i: this.dv.getUint32(0, true), t: this.dv.getUint32(4, true) }
    }
    asDecimal128(settings: BSONValueSettings = {}) {
        if (this.type !== BT.DEC128) throw new Error('Cannot interpret as BSON d128')
        return { $numberDecimal: this.bytes }
    }
    asMinKey(settings: BSONValueSettings = {}) {
        if (this.type !== BT.MIN_KEY) throw new Error('Cannot interpret as BSON MinKey')
        return MinKey
    }
    asMaxKey(settings: BSONValueSettings = {}) {
        if (this.type !== BT.MAX_KEY) throw new Error('Cannot interpret as BSON MaxKey')
        return MaxKey
    }
    asJavaScript(settings: BSONValueSettings = {}) {
        if (this.type !== BT.JS_CODE) throw new Error('Cannot interpret as BSON JavaScript Code')
        return { $code: this.dv.getString(0) }
    }
    asSymbol(settings: BSONValueSettings = {}) {
        if (this.type !== BT.SYMBOL) throw new Error('Cannot interpret as BSON Symbol')
        return { $symbol: this.dv.getString(0) }
    }
    asString(settings: BSONValueSettings = {}) {
        if (this.type !== BT.STRING) throw new Error('Cannot interpret as BSON String')
        return this.dv.getString(0)
    }
    asDocument(settings: BSONValueSettings = {}) {
        if (this.type !== BT.DOCUMENT) throw new Error('Cannot interpret as BSON Document')
        return BSONDocument.from(this.bytes)
    }
    asArray(settings: BSONValueSettings = {}) {
        if (this.type !== BT.ARRAY) throw new Error('Cannot interpret as BSON Array')
        return BSONDocument.from(this.bytes, true).asArray()
    }
    asBinary(settings: BSONValueSettings = {}) {
        if (this.type !== BT.BINARY) throw new Error('Cannot interpret as BSON Binary')
        return { $binary: { subType: this.bytes[4], base64: this.bytes.subarray(5) } }
    }
    asObjectId(settings: BSONValueSettings = {}) {
        if (this.type !== BT.OID) throw new Error('Cannot interpret as BSON ObjectId')
        return { $oid: bytesToHex(this.bytes) }
    }
    asBoolean(settings: BSONValueSettings = {}) {
        if (this.type !== BT.BOOLEAN) throw new Error('Cannot interpret as BSON Boolean')
        const boolValue = this.dv.getUint8(0)
        if (boolValue !== 0x00 && boolValue !== 0x01) {
            throw new Error(`Boolean must be encoded as a zero or one got: ${boolValue} at ${this.bytes.byteOffset}`)
        }
        return Boolean(boolValue)
    }
    asDate(settings: BSONValueSettings = {}) {
        if (this.type !== BT.DATE) throw new Error('Cannot interpret as BSON Date')
        const dateValue = this.dv.getBigInt64(0, true)

        if (settings.style === 'ejson') return { $date: { $numberLong: dateValue.toString() } }

        if (dateValue > MAX_DATE) throw new Error(`Cannot decode date value larger than: ${MAX_DATE} got ${dateValue}`)
        if (dateValue < MIN_DATE) throw new Error(`Cannot decode date value smaller than: ${MIN_DATE} got ${dateValue}`)
        return new Date(Number(dateValue))
    }
    asRegExp(settings: BSONValueSettings = {}) {
        if (this.type !== BT.REGEXP) throw new Error('Cannot interpret as BSON RegExp')
        const [patternSize, pattern] = this.dv.getCStringAndSize(0)
        const [, flags] = this.dv.getCStringAndSize(1 + patternSize)
        return { $regularExpression: { pattern, options: flags } }
    }
    asDBPointer(settings: BSONValueSettings = {}) {
        if (this.type !== BT.DB_POINTER) throw new Error('Cannot interpret as BSON DBPointer')
        const namespaceLength = this.dv.getSize(0)
        const ns = this.dv.getString(0)
        const pointer = { $oid: this.dv.subarray(namespaceLength + SIZEOF.INT32, SIZEOF.INT32 + SIZEOF.OID + namespaceLength) } // ObjectId
        return { $dbPointer: { $id: { $oid: bytesToHex(pointer.$oid) }, $ref: ns } }
    }
    asJavaScriptWithScope(settings: BSONValueSettings = {}) {
        if (this.type !== BT.JS_CODE_SCOPE) throw new Error('Cannot interpret as BSON JavaScript With Scope')
        const $code = this.dv.getString(4)
        const $scope = JSON.parse(BSONDocument.from(this.bytes.subarray(SIZEOF.INT32 + SIZEOF.INT32 + this.dv.getSize(4))).toEJSON())
        return { $code, $scope }
    }
}

function bsonValueBytes(type: number, readerIndex: number, dv: BSONDataView) {
    switch (type) {
        case BT.NULL:
        case BT.UNDEFINED:
        case BT.MIN_KEY:
        case BT.MAX_KEY:
            return EMPTY_VALUE

        case BT.INT32:
            return dv.subarray(readerIndex, readerIndex + SIZEOF.INT32)

        case BT.DOUBLE:
            return dv.subarray(readerIndex, readerIndex + SIZEOF.FLOAT64)

        case BT.INT64:
        case BT.DATE:
        case BT.TIMESTAMP:
            return dv.subarray(readerIndex, readerIndex + SIZEOF.INT64)

        case BT.DEC128:
            return dv.subarray(readerIndex, readerIndex + SIZEOF.D128)

        case BT.OID:
            return dv.subarray(readerIndex, readerIndex + SIZEOF.OID)

        case BT.BOOLEAN:
            return dv.subarray(readerIndex, readerIndex + SIZEOF.BYTE)

        case BT.STRING:
        case BT.SYMBOL:
        case BT.JS_CODE:
            return dv.getSizedSequence(readerIndex)

        case BT.BINARY: {
            const size = dv.getSize(readerIndex)
            return dv.subarray(readerIndex, readerIndex + SIZEOF.INT32 + SIZEOF.BYTE + size)
        }

        case BT.DB_POINTER:
            return dv.subarray(readerIndex, readerIndex + SIZEOF.INT32 + SIZEOF.OID + dv.getInt32(readerIndex, true))

        case BT.ARRAY:
        case BT.DOCUMENT:
            return dv.subarray(readerIndex, readerIndex + dv.getSize(readerIndex))

        case BT.REGEXP: {
            const patternSize = dv.getCStringLength(readerIndex)
            const flagsSize = dv.getCStringLength(readerIndex + SIZEOF.BYTE + patternSize)
            return dv.subarray(readerIndex, readerIndex + patternSize + flagsSize + SIZEOF.BYTE + SIZEOF.BYTE)
        }

        case BT.JS_CODE_SCOPE: {
            const codeSize = dv.getSize(readerIndex)
            return dv.subarray(readerIndex, readerIndex + codeSize)
        }

        default:
            throw new Error(`No Parser for 0x${byteToHex(type)} off: ${readerIndex}`)
    }
}

export function* entriesFromBSON(bsonBytes: Uint8Array): Generator<{ readonly key: string, readonly type: number, readonly bytes: Uint8Array }> {
    let dv = new BSONDataView(bsonBytes.buffer, bsonBytes.byteOffset, bsonBytes.byteLength)
    const size = dv.getSize()
    dv = new BSONDataView(bsonBytes.buffer, bsonBytes.byteOffset, size)

    let readerIndex = 4

    while (readerIndex < size) {
        const type = dv.getUint8(readerIndex)
        readerIndex += SIZEOF.BYTE

        if (type === 0x00) {
            if (readerIndex < size) throw new Error(`readerIndex=${readerIndex} fell short of the size=${size}`)
            break
        }

        const [keyLen, key] = dv.getCStringAndSize(readerIndex)
        readerIndex += keyLen + SIZEOF.BYTE

        const bytes = bsonValueBytes(type, readerIndex, dv)

        readerIndex += bytes.byteLength

        yield { key, type, bytes }
    }
}

export class BSONDocument extends Map {
    [$size]: number
    [$bytes]: Uint8Array
    [$isArray]: boolean

    constructor() {
        super()
        this[$size] = 5
        this[$bytes] = new Uint8Array([5, 0, 0, 0, 0])
        this[$isArray] = false
    }

    static from(bytes: Uint8Array, isArray = false): BSONDocument {
        const map = new BSONDocument()

        if (!(bytes instanceof Uint8Array)) throw new Error('Must provide a Uint8Array')

        const dv = new BSONDataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
        const size = dv.getSize()

        map[$isArray] = isArray
        map[$size] = size
        map[$bytes] = bytes

        const entries = entriesFromBSON(bytes)
        for (const bsonEntry of entries) {
            if (isArray) {
                if (!/\d+/.test(bsonEntry.key)) {
                    throw new Error(`Array index must be a numerical key, got "${bsonEntry.key}"`)
                }
                if (!(Number(bsonEntry.key) >= 0 && Number(bsonEntry.key) <= MAX_ARRAY_INDEX)) {
                    throw new Error(`Array index must be between 0 and ${MAX_ARRAY_INDEX}, got ${bsonEntry.key}`)
                }
            }
            map.set(bsonEntry.key, bsonEntry)
        }

        return map
    }

    toString() {
        let kvStrings = ['BSONDocument {\n']
        for (const [key, value] of this.entries()) {
            kvStrings.push(`  ${key} => ${value}\n`)
        }
        //    [$bytes]=${bytesToHex(this[$bytes])}\n
        kvStrings.push(`  [$size]=${this[$size]}\n}`)
        return `${kvStrings.join(' ')}`
    }

    inspect() { return this.toEJSON() }
    [Symbol.for('nodejs.util.inspect.custom')]() { return this.inspect() }

    toRecord() {
        const o = this[$isArray] ? [] : Object.create(null)

        for (const [key, bsonValue] of this.entiresAsBSONValues()) {
            if (key === '__proto__') {
                throw Error('say no to proto')
            } else {
                o[key] = bsonValue.toNative()
            }
        }

        return Object.freeze(o)
    }

    toMap() {
        return new Map(Array.from(this.entries()).map(([k, v]) => [k, v.toNative()]))
    }

    toEJSON() {
        if (this[$isArray]) {
            return this.asArray().toEJSON()
        }
        const sb = []
        for (const [key, bsonValue] of this.entiresAsBSONValues()) {
            sb.push(`"${key}":${bsonValue.toEJSON()}`)
        }
        return `{${sb.join(',')}}`
    }

    *entiresAsBSONValues() {
        for (const [key, { type, bytes }] of this.entries()) {
            yield [key, new BSONValue(type, bytes)]
        }
    }

    asArray() {
        if (this[$isArray] === false) throw new Error(`Document is not an array ${this.toString()}`)
        const array = new BSONArray(this.size)
        for (const [key, value] of this.entiresAsBSONValues()) {
            array[key] = value
        }
        return array
    }

    [Symbol.species]() {
        return BSONDocument
    }
}


export class BSONArray extends Array<BSONValue> {
    toEJSON() {
        return `[${Array.from(this.values()).map(v => v.toEJSON()).join(',')}]`
    }
    [Symbol.species]() {
        return BSONArray
    }
}
