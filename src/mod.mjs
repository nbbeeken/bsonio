//@ts-check

const checkForMath = (potentialGlobal) => {
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


const raw = /[\w*+\-./@]/
/**
 * @param {number} code
 * @param {number} length
 * @returns {string}
 */
const hex = function (code, length) {
	var result = code.toString(16)
	while (result.length < length) result = '0' + result
	return result
}
/**
 * @param {string} string
 * @returns
 */
const escapeUriStyle = (string) => {
	let result = ''
	let index = 0
	while (index < string.length) {
		let chr = string.charAt(index++)
		if (raw.exec(chr)) {
			result += chr
		} else {
			let code = chr.charCodeAt(0)
			if (code < 256) {
				result += '%' + hex(code, 2)
			} else {
				result += '%u' + hex(code, 4).toUpperCase()
			}
		}
	}
	return result
}

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
const decode_utf8 = (bytes) => decodeURIComponent(escapeUriStyle(Array.from(bytes).map(b => String.fromCharCode(b)).join('')))

const $size = Symbol('size')
const $value = Symbol('value')
const $bytes = Symbol('bytes')
const $isArray = Symbol('isArray')
export const MinKey = Symbol('MinKey')
export const MaxKey = Symbol('MaxKey')

const MAX_DATE = 8640000000000000n
const MIN_DATE = -8640000000000000n

const DOUBLE = 0x01
const STRING = 0x02
const DOCUMENT = 0x03
const ARRAY = 0x04
const BINARY = 0x05
const UNDEFINED = 0x06
const OID = 0x07
const BOOLEAN = 0x08
const DATE = 0x09
const NULL = 0x0A
const REGEXP = 0x0B
const DB_POINTER = 0x0C
const JS_CODE = 0x0D
const SYMBOL = 0x0E
const JS_CODE_SCOPE = 0x0F
const INT32 = 0x10
const TIMESTAMP = 0x11
const INT64 = 0x12
const DEC128 = 0x13
const MIN_KEY = 0xFF
const MAX_KEY = 0x7F


/** @type {Map<number, (readerIndex: number, dv: BSONDataView) => [bytes: Uint8Array, value: unknown]>} */
const bsonTypeParse = new Map()
bsonTypeParse.set(NULL, () => [new Uint8Array(), null])
bsonTypeParse.set(UNDEFINED, () => [new Uint8Array(), undefined])
bsonTypeParse.set(MIN_KEY, () => [new Uint8Array(), MinKey])
bsonTypeParse.set(MAX_KEY, () => [new Uint8Array(), MaxKey])
bsonTypeParse.set(DOUBLE, (readerIndex, dv) => [dv._uint8.subarray(readerIndex, readerIndex + 8), dv.getFloat64(readerIndex, true)])
bsonTypeParse.set(INT32, (readerIndex, dv) => [dv._uint8.subarray(readerIndex, readerIndex + 4), dv.getInt32(readerIndex, true)])
bsonTypeParse.set(INT64, (readerIndex, dv) => [dv._uint8.subarray(readerIndex, readerIndex + 8), dv.getBigInt64(readerIndex, true)])
bsonTypeParse.set(DATE, (readerIndex, dv) => {
	const dateValue = dv.getBigInt64(readerIndex, true)
	if (dateValue > MAX_DATE) throw new Error(`Cannot decode date value larger than: ${MAX_DATE} got ${dateValue}`)
	if (dateValue < MIN_DATE) throw new Error(`Cannot decode date value larger than: ${MAX_DATE} got ${dateValue}`)
	return [dv._uint8.subarray(readerIndex, readerIndex + 8), new Date(Number(dateValue))]
})
bsonTypeParse.set(TIMESTAMP, (readerIndex, dv) => [dv._uint8.subarray(readerIndex, readerIndex + 8), dv.getBigUint64(readerIndex, true)])
bsonTypeParse.set(BOOLEAN, (readerIndex, dv) => [dv._uint8.subarray(readerIndex, readerIndex + 1), dv.getUint8(readerIndex) === 0x00 ? false : true])
bsonTypeParse.set(STRING, (readerIndex, dv) => dv.getSizedString(readerIndex))
bsonTypeParse.set(SYMBOL, (readerIndex, dv) => dv.getSizedString(readerIndex))
bsonTypeParse.set(JS_CODE, (readerIndex, dv) => dv.getSizedString(readerIndex))
bsonTypeParse.set(BINARY, (readerIndex, dv) => dv.getSizedSequence(readerIndex))
bsonTypeParse.set(DEC128, (readerIndex, dv) => [dv._uint8.subarray(readerIndex, readerIndex + 16), dv._uint8.subarray(readerIndex, readerIndex + 16)])
bsonTypeParse.set(OID, (readerIndex, dv) => [dv._uint8.subarray(readerIndex, readerIndex + 12), dv._uint8.subarray(readerIndex, readerIndex + 12)])
bsonTypeParse.set(REGEXP, (readerIndex, dv) => {
	const [patternSize, pattern] = dv.getCStringAndSize(readerIndex)
	const [flagsSize, flags] = dv.getCStringAndSize(readerIndex + 1 + patternSize)
	return [dv._uint8.subarray(readerIndex, readerIndex + patternSize + flagsSize + 2), { pattern, flags }]
})
bsonTypeParse.set(DB_POINTER, (readerIndex, dv) => {
	const [nsSeq, ns] = dv.getSizedString(readerIndex)
	const pointer = dv._uint8.subarray(readerIndex + nsSeq.byteLength, readerIndex + 12 + nsSeq.byteLength)
	return [dv._uint8.subarray(readerIndex, readerIndex + 12 + nsSeq.byteLength), { ns, pointer }]
})
bsonTypeParse.set(DOCUMENT, (readerIndex, dv) => {
	const doc = BSONDocument.from(dv._uint8.subarray(readerIndex))
	return [dv._uint8.subarray(readerIndex, readerIndex + doc[$size] + 1), doc]
})
bsonTypeParse.set(ARRAY, (readerIndex, dv) => {
	const doc = BSONDocument.from(dv._uint8.subarray(readerIndex))
	doc[$isArray] = true
	return [dv._uint8.subarray(readerIndex, readerIndex + doc[$size] + 1), doc]
})
bsonTypeParse.set(JS_CODE_SCOPE, (readerIndex, dv) => {
	const size = dv.getInt32(readerIndex, true)
	const [codeSeq, code] = dv.getSizedString(readerIndex + 4)
	const scope = BSONDocument.from(dv._uint8.subarray(readerIndex + 4 + codeSeq.byteLength))
	return [
		dv._uint8.subarray(readerIndex, readerIndex + size),
		{ size, code, scope }
	]
})


export class BSONDataView extends DataView {
	/**
	 * @param {ArrayBufferLike} buffer
	 * @param {number} byteOffset
	 * @param {number} byteLength
	 */
	constructor(buffer, byteOffset, byteLength) {
		super(buffer, byteOffset, byteLength)
		this._uint8 = new Uint8Array(buffer, byteOffset, byteLength)
		if (getGlobal().TextDecoder) this.decoder = new TextDecoder('utf-8', { fatal: true })
		else this.decoder = { decode: decode_utf8 }
	}
	/**
	 * @param {number} [offset]
	 * @returns {Uint8Array}
	 */
	getCStringSequence(offset) {
		offset ??= 0
		const nullTerminatorIndex = this._uint8.subarray(offset).findIndex(byte => byte === 0) + offset
		return this._uint8.subarray(offset, nullTerminatorIndex)
	}
	/**
	 * @param {number} [offset]
	 * @returns {string}
	 */
	getCString(offset) {
		const seq = this.getCStringSequence(offset)
		const isASCII = seq.find(byte => byte > 0x7F) == null
		if (isASCII) {
			return Array.from(seq).map(v => String.fromCharCode(v)).join('')
		}
		return this.decoder.decode(seq)
	}
	/**
	 * @param {number} [offset]
	 * @returns {[number, string]}
	 */
	getCStringAndSize(offset) {
		const seq = this.getCStringSequence(offset)
		const isASCII = seq.find(byte => byte > 0x7F) == null
		if (isASCII) {
			const chars = Array.from(seq).map(v => String.fromCharCode(v))
			return [chars.length, chars.join('')]
		}
		return [seq.byteLength, this.decoder.decode(seq)]
	}
	/**
	 * @param {number} [offset]
	 * @returns {[Uint8Array, string]}
	 */
	getSizedString(offset) {
		const size = this.getInt32(offset, true)
		const seq = this._uint8.subarray(offset, offset + 4 + size)
		if (seq[seq.length - 1] !== 0x00) throw new Error(`utf8 string must end in 0x00, size=${size}`)

		const seqOfChar = this._uint8.subarray(offset + 4, offset + 4 + size - 1)
		const isASCII = seqOfChar.find(byte => byte > 0x7F) == null
		if (isASCII) {
			const chars = Array.from(seqOfChar).map(v => String.fromCharCode(v))
			return [seq, chars.join('')]
		}

		return [seq, this.decoder.decode(seqOfChar)]
	}
	/**
	 * @param {number} [offset]
	 * @returns {[Uint8Array, Uint8Array]}
	 */
	getSizedSequence(offset) {
		const size = this.getInt32(offset, true)
		const seq = this._uint8.subarray(offset, offset + 4 + 1 + size)
		return [seq, seq]
	}
}

export class BSONValue {
	/**
	 * @param {number} type BSON Type
	 * @param {Uint8Array} bytes
	 * @param {any} value
	 */
	constructor(type, bytes, value) {
		this.type = type
		this.bytes = bytes
		this[$value] = value
	}

	get value() {
		switch (this.type) {
			case DEC128:
				return { decimal128: this[$value] }
			case BINARY:
				return { binary: this[$value] }
			case OID:
				return { oid: this[$value] }
			default:
				return this[$value]
		}
	}
}

/**
 * @param {number} size
 * @param {BSONDataView} dv
 * @param {Uint8Array} bytes
 * @returns {Generator<[key: string, value: BSONValue]>}
 */
export function* iterateBson(size, dv, bytes) {
	let readerIndex = 4

	// /** @type {Array<[key: string, value: BSONValue]>} */
	// let entries = []

	while (readerIndex < size) {
		const type = dv.getUint8(readerIndex)
		readerIndex += 1

		if (type === 0x00 || readerIndex >= size) {
			break
		}

		const [keyLen, key] = dv.getCStringAndSize(readerIndex)
		readerIndex += keyLen + 1

		const bsonParseFn = bsonTypeParse.get(type)
		if (bsonParseFn == null) throw new Error(`No Parser for ${type.toString(16)}`)
		const [valueBytes, value] = bsonParseFn(readerIndex, dv)

		readerIndex += valueBytes.byteLength

		yield [key, new BSONValue(type, valueBytes, value)]
	}
}

export class BSONDocument extends Map {
	constructor() {
		super()
		this[$size] = 5
		this[$bytes] = new Uint8Array([5, 0, 0, 0, 0])
		this[$isArray] = false
	}

	/**
	 * @param {Uint8Array} bytes
	 * @returns {BSONDocument}
	 */
	static from(bytes) {
		const map = new BSONDocument()

		let dv = new BSONDataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
		const size = dv.getInt32(0, true)
		dv = new BSONDataView(bytes.buffer, bytes.byteOffset, size)

		map[$size] = size
		map[$bytes] = bytes

		const entries = iterateBson(size, dv, bytes)
		for (const [key, value] of entries) {
			map.set(key, value)
		}

		return map
	}

	toString() {
		let kvStrings = ['BSONDocument {']
		for (const [key, value] of this.entries()) {
			kvStrings.push(`${key} => ${value}`)
		}
		kvStrings.push('}')
		return `${kvStrings.join(' ')} :: size=${this[$size]} bytes=${this[$bytes]}`
	}

	toRecord() {
		const o = this[$isArray] ? [] : {}

		for (const [key, { value }] of this.entries()) {
			if (key === '__proto__') {
				continue
			} else if (value instanceof BSONDocument) {
				o[key] = value.toRecord()
			} else {
				o[key] = value
			}
		}

		return Object.freeze(o)
	}
}

export const BSON = {
	BSONDocument
}
