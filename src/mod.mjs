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


/**
 * @param {Uint8Array} bytes
 * @returns  {string}
 */
const bytesToHex = (bytes) => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')

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
const $dv = Symbol('dataView')
const $bytes = Symbol('bytes')
const $isArray = Symbol('isArray')
export const MinKey = Symbol('MinKey')
export const MaxKey = Symbol('MaxKey')

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

const BT_LOOKUP = Object.freeze(Object.fromEntries(Object.entries(BT).map(([typeName, typeByte]) => [typeByte, typeName])))

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
	/** @returns {number} */
	getSize(offset = 0) {
		const size = this.getInt32(offset, true)
		if (size < 0) throw new Error(`Size must be positive, got ${size}`)
		return size
	}
	/** @returns {number} */
	getCStringLength(offset = 0) {
		const nullTerminatorIndex = this._uint8.subarray(offset).findIndex(byte => byte === 0) + offset
		return nullTerminatorIndex - offset
	}
	/**
	 * @param {number} [offset]
	 * @returns {Uint8Array}
	 */
	getCStringSequence(offset = 0) {
		return this._uint8.subarray(offset, offset + this.getCStringLength(offset))
	}
	/**
	 * @param {number} [offset]
	 * @returns {string}
	 */
	getCString(offset = 0) {
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
	getCStringAndSize(offset = 0) {
		const seq = this.getCStringSequence(offset)
		const isASCII = seq.find(byte => byte > 0x7F) == null
		if (isASCII) {
			const chars = Array.from(seq).map(v => String.fromCharCode(v))
			return [chars.length, chars.join('')]
		}
		return [seq.byteLength, this.decoder.decode(seq)]
	}
	/**
	 * Decodes a string a view on based on the LE int32 written at the offset.
	 * @param {number} [offset]
	 * @returns {string}
	 */
	getString(offset = 0) {
		const size = this.getSize(offset)
		const seq = this._uint8.subarray(offset + 4, offset + 4 + size)
		if (seq[seq.byteLength - 1] !== 0x00) {
			throw new Error(`utf8 string must end in 0x00, size=${size}`)
		}

		const seqOfChar = this._uint8.subarray(offset + 4, offset + 4 + size - 1)
		const isASCII = seqOfChar.find(byte => byte > 0x7F) == null
		if (isASCII) {
			const chars = Array.from(seqOfChar).map(v => String.fromCharCode(v))
			return chars.join('')
		}

		return this.decoder.decode(seqOfChar)
	}
	/**
	 * Returns a view on based on the LE int32 written at the offset.
	 * @param {number} [offset]
	 * @returns {Uint8Array}
	 */
	getSizedSequence(offset = 0) {
		const size = this.getInt32(offset, true)
		const seq = this._uint8.subarray(offset, offset + 4 + size)
		return seq
	}
}

export class BSONValue {
	/**
	 * @param {number} type BSON Type
	 * @param {Uint8Array} bytes
	 */
	constructor(type, bytes) {
		this.type = type
		this.bytes = bytes
		this[$dv] = new BSONDataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
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

	toNative(settings = {}) {
		const dv = this[$dv]
		switch (this.type) {
			case BT.NULL: return null
			case BT.UNDEFINED: return null

			case BT.DOUBLE: return dv.getFloat64(0, true)
			case BT.INT32: return dv.getInt32(0, true)
			case BT.TIMESTAMP: return dv.getBigUint64(0, true)
			case BT.INT64: return dv.getBigInt64(0, true)
			case BT.DEC128: return { $dec128: this.bytes }
			case BT.MIN_KEY: return MinKey
			case BT.MAX_KEY: return MaxKey

			case BT.JS_CODE:
			case BT.SYMBOL:
			case BT.STRING: return dv.getString(0)

			case BT.DOCUMENT: return BSONDocument.from(this.bytes)
			case BT.ARRAY: return BSONDocument.from(this.bytes, true)
			case BT.BINARY: return { $subtype: this.bytes[4], $binary: this.bytes.subarray(5) }
			case BT.OID: return { $oid: this.bytes }

			case BT.BOOLEAN: {
				const boolValue = dv.getUint8(0)
				if (boolValue !== 0x00 && boolValue !== 0x01) {
					throw new Error(`Boolean must be encoded as a zero or one got: ${boolValue} at ${this.bytes.byteOffset}`)
				}
				return Boolean(boolValue)
			}

			case BT.DATE: {
				const dateValue = dv.getBigInt64(0, true)
				if (dateValue > MAX_DATE) throw new Error(`Cannot decode date value larger than: ${MAX_DATE} got ${dateValue}`)
				if (dateValue < MIN_DATE) throw new Error(`Cannot decode date value smaller than: ${MIN_DATE} got ${dateValue}`)
				return new Date(Number(dateValue))
			}

			case BT.REGEXP: {
				const [patternSize, pattern] = dv.getCStringAndSize(0)
				const flags = dv.getCString(1 + patternSize)
				return { pattern, flags }
			}

			case BT.DB_POINTER: {
				const namespaceLength = dv.getSize(0)
				const ns = dv.getString(0)
				const pointer = { $oid: dv._uint8.subarray(namespaceLength, 12 + namespaceLength) } // ObjectId
				return { ns, pointer }
			}

			case BT.JS_CODE_SCOPE: {
				const code = dv.getString(4)
				const scope = BSONDocument.from(this.bytes.subarray(4 + 4 + dv.getSize(4)))
				return { code, scope }
			}

			default: throw new Error(`Unknown BSON type`)
		}
	}
}

/**
 * @param {number} type
 * @param {number} readerIndex
 * @param {BSONDataView} dv
 * @returns {Uint8Array}
 */
function bsonValueBytes(type, readerIndex, dv) {
	switch (type) {
		case BT.NULL: return new Uint8Array()
		case BT.UNDEFINED: return new Uint8Array()
		case BT.MIN_KEY: return new Uint8Array()
		case BT.MAX_KEY: return new Uint8Array()
		case BT.DOUBLE: return dv._uint8.subarray(readerIndex, readerIndex + 8)
		case BT.INT32: return dv._uint8.subarray(readerIndex, readerIndex + 4)
		case BT.INT64: return dv._uint8.subarray(readerIndex, readerIndex + 8)
		case BT.DATE: return dv._uint8.subarray(readerIndex, readerIndex + 8)
		case BT.TIMESTAMP: return dv._uint8.subarray(readerIndex, readerIndex + 8)
		case BT.BOOLEAN: return dv._uint8.subarray(readerIndex, readerIndex + 1)
		case BT.STRING: return dv.getSizedSequence(readerIndex)
		case BT.SYMBOL: return dv.getSizedSequence(readerIndex)
		case BT.JS_CODE: return dv.getSizedSequence(readerIndex)
		case BT.BINARY: {
			const size = dv.getSize(readerIndex)
			// 5 accounts for subtype byte
			return dv._uint8.subarray(readerIndex, readerIndex + 5 + size)
		}
		case BT.DEC128: return dv._uint8.subarray(readerIndex, readerIndex + 16)
		case BT.OID: return dv._uint8.subarray(readerIndex, readerIndex + 12)
		case BT.DB_POINTER: return dv._uint8.subarray(readerIndex, readerIndex + 4 + 12 + dv.getInt32(readerIndex, true))

		case BT.ARRAY:
		case BT.DOCUMENT: return dv._uint8.subarray(readerIndex, readerIndex + dv.getInt32(readerIndex, true) + 1)

		case BT.REGEXP: {
			const patternSize = dv.getCStringLength(readerIndex)
			const flagsSize = dv.getCStringLength(readerIndex + 1 + patternSize)
			return dv._uint8.subarray(readerIndex, readerIndex + patternSize + flagsSize + 2)
		}

		case BT.JS_CODE_SCOPE: {
			const codeSize = dv.getSize(readerIndex)
			return dv._uint8.subarray(readerIndex, readerIndex + codeSize)
		}

		default:
			throw new Error(`No Parser for 0x${type.toString(16)} off: ${readerIndex}`)
	}
}

/**
 * @param {Uint8Array} bytes
 * @returns {Generator<[key: string, value: BSONValue]>}
 */
export function* iterateBson(bytes) {
	let dv = new BSONDataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
	const size = dv.getSize()
	dv = new BSONDataView(bytes.buffer, bytes.byteOffset, size)

	let readerIndex = 4

	while (readerIndex < size) {
		const type = dv.getUint8(readerIndex)
		readerIndex += 1

		if (type === 0x00 || readerIndex >= size) {
			break
		}

		const [keyLen, key] = dv.getCStringAndSize(readerIndex)
		readerIndex += keyLen + 1

		const valueBytes = bsonValueBytes(type, readerIndex, dv)

		readerIndex += valueBytes.byteLength

		yield [key, new BSONValue(type, valueBytes)]
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
	static from(bytes, isArray = false) {
		const map = new BSONDocument()

		if (!(bytes instanceof Uint8Array)) throw new Error('Uint8Array pwease')

		const dv = new BSONDataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
		const size = dv.getSize()

		map[$isArray] = isArray
		map[$size] = size
		map[$bytes] = bytes

		const entries = iterateBson(bytes)
		for (const [key, value] of entries) {
			if (isArray) {
				if (!/\d+/.test(key)) {
					throw new Error(`Array index must be a numerical key, got "${key}"`)
				}
				if (!(Number(key) >= 0 && Number(key) <= MAX_ARRAY_INDEX)) {
					throw new Error(`Array index must be between 0 and ${MAX_ARRAY_INDEX}, got ${key}`)
				}
			}
			map.set(key, value)
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
	inspect() {
		return this.toString()
	}
	[Symbol.for('nodejs.util.inspect.custom')]() {
		return this.toString()
	}

	toRecord() {
		const o = this[$isArray] ? [] : Object.create(null)

		for (const [key, bsonValue] of this.entries()) {
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
}

export const BSON = {
	BSONDocument
}
