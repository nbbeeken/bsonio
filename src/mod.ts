import { BASE64 } from './base64.js'
import { D128 } from './d128.js'
import { UTF8Decoder } from './utf8.js'

type DeepReadonly<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>
}

const checkForMath: (potentialGlobal: unknown) => Record<string, unknown> | null = (potentialGlobal: unknown) => {
	if (
		potentialGlobal != null &&
		typeof potentialGlobal === 'object' &&
		'Math' in potentialGlobal &&
		(potentialGlobal as { Math?: unknown }).Math === Math
	) {
		return potentialGlobal as Record<string, unknown>
	}
	return null
}

// eslint-disable-next-line init-declarations
declare const global: unknown

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
export const getGlobal: <T>() => T = () =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	checkForMath(typeof globalThis === 'object' && globalThis) ??
	checkForMath(typeof window === 'object' && window) ??
	checkForMath(typeof self === 'object' && self) ??
	checkForMath(typeof global === 'object' && global) ??
	// eslint-disable-next-line no-new-func
	// eslint-disable-next-line @typescript-eslint/no-implied-eval
	Function('return this')()

const byteToHex = (byte: number): string => byte.toString(16).padStart(2, '0')
const bytesToHex = (bytes: DeepReadonly<Uint8Array>): string =>
	Array.from(bytes)
		.map((byte) => byteToHex(byte))
		.join('')

const kSize = Symbol('size')
const kDataview = Symbol('dataView')
const kBytes = Symbol('bytes')
const kType = Symbol('type')
const kIsArray = Symbol('isArray')
export const MinKey = Symbol('MinKey')
export const MaxKey = Symbol('MaxKey')

const SIZEOF = Object.freeze({
	BYTE: 1,
	D128: 16,
	FLOAT64: 8,
	INT32: 4,
	INT64: 8,
	OID: 12,
})

const EMPTY_VALUE = new Uint8Array(Object.freeze(new ArrayBuffer(0)))

const MAX_DATE = 8640000000000000n
const MIN_DATE = -8640000000000000n
const MAX_ARRAY_INDEX = 0xffff_ffff - 1

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
	NULL: 0x0a,
	REGEXP: 0x0b,
	DB_POINTER: 0x0c,
	JS_CODE: 0x0d,
	SYMBOL: 0x0e,
	JS_CODE_SCOPE: 0x0f,
	INT32: 0x10,
	TIMESTAMP: 0x11,
	INT64: 0x12,
	DEC128: 0x13,
	MIN_KEY: 0xff,
	MAX_KEY: 0x7f,
})

const DECODER: TextDecoder = getGlobal<{ TextDecoder?: typeof TextDecoder }>().TextDecoder
	? new TextDecoder('utf-8', { fatal: true })
	: new UTF8Decoder()

const VALID_BSON_TYPE_BYTES = new Set(Object.values(BT))
export const BT_LOOKUP = Object.freeze(
	Object.fromEntries(
		Object.entries(BT).map(([typeName, typeByte]: readonly [typeName: string, typeByte: number]) => [
			typeByte,
			typeName,
		])
	)
)

export class BSONDataView extends DataView {
	[kBytes]: Uint8Array

	constructor(buffer: ArrayBufferLike, byteOffset: number, byteLength: number) {
		super(buffer, byteOffset, byteLength)
		this[kBytes] = new Uint8Array(buffer, byteOffset, byteLength)
	}

	subarray(begin?: number, end?: number): Uint8Array {
		return this[kBytes].subarray(begin, end)
	}

	getSize(offset = 0): number {
		const size = this.getInt32(offset, true)
		if (size < 0) {
			throw new Error(`Size must be positive, got ${size}`)
		}
		return size
	}

	getCStringLength(offset = 0): number {
		let nullTerminatorIndex = offset
		for (; this[kBytes][nullTerminatorIndex] !== 0x00; nullTerminatorIndex += 1) {
			// Counting...
		}
		return nullTerminatorIndex - offset
	}

	getCStringAndSize(offset = 0): { length: number; cString: string } {
		let isASCII = true
		const size = this.getCStringLength(offset)
		const chars = new Array(size)
		for (let i = 0; i < size; i += 1) {
			const byte = this[kBytes][i + offset]
			if (byte > 0x7f) {
				isASCII = false
				break
			}
			chars[i] = String.fromCharCode(byte)
		}
		if (isASCII) {
			return { cString: chars.join(''), length: chars.length }
		}
		const seq = this.subarray(offset, offset + size)
		return { cString: DECODER.decode(seq), length: seq.byteLength }
	}

	/** Decodes a string a view on based on the LE int32 written at the offset */
	getString(offset = 0): string {
		const size = this.getSize(offset)
		const nullTerminatorIndex = offset + SIZEOF.INT32 + size - 1
		if (this[kBytes][nullTerminatorIndex] !== 0x00) {
			throw new Error(`utf8 string must end in 0x00, size=${size}`)
		}
		let isASCII = true
		const chars = new Array(size - 1)
		for (
			let byteIdx = offset + SIZEOF.INT32, charIdx = 0;
			byteIdx < nullTerminatorIndex && charIdx < chars.length;
			charIdx += 1, byteIdx += 1
		) {
			const byte = this[kBytes][byteIdx]
			if (byte > 0x7f) {
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
	getSizedSequence(offset = 0): Uint8Array {
		const size = this.getInt32(offset, true)
		const seq = this[kBytes].subarray(offset, offset + 4 + size)
		return seq
	}

	getBigUint128(offset = 0, littleEndian = false): bigint {
		if (littleEndian) {
			const low = this.getBigUint64(0, true)
			const high = this.getBigUint64(8, true)
			return (high << 64n) | low
		}
		const high = this.getBigUint64(0, false)
		const low = this.getBigUint64(8, false)
		return (high << 64n) | low
	}
}

export type BSONValueSettings = Record<string, unknown>

export class BSONValue {
	[kDataview]?: BSONDataView

	bytes!: Uint8Array

	type!: number

	/**
	 * @param {number} type BSON Type
	 * @param {Uint8Array} bytes
	 */
	constructor(type: number, bytes: Uint8Array) {
		/*
		 * This.type = type
		 * this.bytes = bytes
		 * Symbol properties also have a performance cost, its small but we shouldn't pay it on such a hot path
		 * this[$type] = type
		 * this[$bytes] = bytes
		 * defineProperty TANKS performance :(
		 */
		Object.defineProperty(this, 'type', { configurable: false, enumerable: true, value: type, writable: false })
		Object.defineProperty(this, 'bytes', { configurable: false, enumerable: true, value: bytes, writable: false })
	}

	get dv(): BSONDataView {
		if (this[kDataview] == null) {
			this[kDataview] = new BSONDataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
		}
		// @ts-expect-error - TS cannot narrow the type of a symbol property
		return this[kDataview]
	}

	toString(): string {
		return `BSONValue{ type: ${this.type}(${BT_LOOKUP[this.type]}) bytes: "${bytesToHex(this.bytes)}" }`
	}

	inspect(): string {
		return this.toString()
	}

	[Symbol.for('nodejs.util.inspect.custom')](): string {
		return this.toString()
	}

	toNative(settings: BSONValueSettings = {}): unknown {
		switch (this.type) {
			case BT.NULL:
				return this.asNull(settings)
			case BT.UNDEFINED:
				return this.asUndefined(settings)
			case BT.DOUBLE:
				return this.asDouble(settings)
			case BT.INT32:
				return this.asInt32(settings)
			case BT.TIMESTAMP:
				return this.asTimestamp(settings)
			case BT.INT64:
				return this.asBigInt64(settings)
			case BT.DEC128:
				return this.asDecimal128(settings)
			case BT.MIN_KEY:
				return this.asMinKey(settings)
			case BT.MAX_KEY:
				return this.asMaxKey(settings)
			case BT.JS_CODE:
				return this.asJavaScript(settings)
			case BT.SYMBOL:
				return this.asSymbol(settings)
			case BT.STRING:
				return this.asString(settings)
			case BT.DOCUMENT:
				return this.asDocument(settings)
			case BT.ARRAY:
				return this.asArray(settings)
			case BT.BINARY:
				return this.asBinary(settings)
			case BT.OID:
				return this.asObjectId(settings)
			case BT.BOOLEAN:
				return this.asBoolean(settings)
			case BT.DATE:
				return this.asDate(settings)
			case BT.REGEXP:
				return this.asRegExp(settings)
			case BT.DB_POINTER:
				return this.asDBPointer(settings)
			case BT.JS_CODE_SCOPE:
				return this.asJavaScriptWithScope(settings)
			default:
				throw new Error(`Unknown BSON type`)
		}
	}

	toEJSON(): string {
		const settings = { style: 'ejson' } as const
		switch (this.type) {
			case BT.NULL:
				return 'null'
			case BT.UNDEFINED:
				return '{"$undefined":true}'
			case BT.DOUBLE: {
				const double = this.asDouble(settings)
				if (Number.isInteger(double)) {
					if (Object.is(-0, double)) {
						return `{"$numberDouble":"-${double.toFixed(1)}"}`
					}
					if (double.toFixed(1).length >= 13) {
						return `{"$numberDouble":"${double.toExponential(13).toUpperCase()}"}`
					}
					return `{"$numberDouble":"${double.toFixed(1)}"}`
				}
				return `{"$numberDouble":"${double}"}`
			}
			case BT.INT32:
				return `{"$numberInt":"${String(this.asInt32(settings))}"}`
			case BT.TIMESTAMP:
				return `{"$timestamp":${JSON.stringify(this.asTimestamp(settings))}}`
			case BT.INT64:
				return `{"$numberLong":"${String(this.asBigInt64(settings))}"}`
			case BT.DEC128:
				return `{"$numberDecimal":"${D128.toString(this.bytes)}"}`
			case BT.MIN_KEY:
				return '{"$minKey":1}'
			case BT.MAX_KEY:
				return '{"$maxKey":1}'
			case BT.JS_CODE:
				return JSON.stringify(this.asJavaScript(settings))
			case BT.SYMBOL:
				return JSON.stringify(this.asSymbol(settings))
			case BT.STRING:
				return JSON.stringify(this.asString(settings))
			case BT.DOCUMENT:
				return this.asDocument(settings).toEJSON()
			case BT.ARRAY:
				return this.asArray(settings).toEJSON()
			case BT.BINARY: {
				const bin = this.asBinary()
				if (bin.$binary.subType === 0x02) {
					return `{"$binary":{"base64":"${BASE64.fromByteArray(
						bin.$binary.base64.subarray(SIZEOF.INT32)
					)}", "subType":"${bin.$binary.subType.toString(16).padStart(2, '0')}"}}`
				}
				return `{"$binary":{"base64":"${BASE64.fromByteArray(bin.$binary.base64)}", "subType":"${bin.$binary.subType
					.toString(16)
					.padStart(2, '0')}"}}`
			}
			case BT.OID:
				return JSON.stringify(this.asObjectId(settings))
			case BT.BOOLEAN:
				return String(this.asBoolean(settings))
			case BT.DATE:
				return JSON.stringify(this.asDate(settings))
			case BT.REGEXP:
				return JSON.stringify(this.asRegExp(settings))
			case BT.DB_POINTER:
				return JSON.stringify(this.asDBPointer())
			case BT.JS_CODE_SCOPE:
				return JSON.stringify(this.asJavaScriptWithScope())
			default:
				throw new Error(`Unknown BSON type`)
		}
	}

	asNull(settings: BSONValueSettings = {}): null {
		if (this.type !== BT.NULL) {
			throw new Error('Cannot interpret as BSON null')
		}
		return null
	}

	asUndefined(settings: BSONValueSettings = {}): null {
		if (this.type !== BT.UNDEFINED) {
			throw new Error('Cannot interpret as BSON undefined')
		}
		return null
	}

	asDouble(settings: BSONValueSettings = {}): number {
		if (this.type !== BT.DOUBLE) {
			throw new Error('Cannot interpret as BSON double')
		}
		return this.dv.getFloat64(0, true)
	}

	asInt32(settings: BSONValueSettings = {}): number {
		if (this.type !== BT.INT32) {
			throw new Error('Cannot interpret as BSON int32')
		}
		return this.dv.getInt32(0, true)
	}

	asBigInt64(settings: BSONValueSettings = {}): bigint {
		if (this.type !== BT.INT64) {
			throw new Error('Cannot interpret as BSON int64')
		}
		return this.dv.getBigInt64(0, true)
	}

	asTimestamp(settings: BSONValueSettings = {}): { i: number; t: number } {
		if (this.type !== BT.TIMESTAMP) {
			throw new Error('Cannot interpret as BSON timestamp')
		}
		return { i: this.dv.getUint32(0, true), t: this.dv.getUint32(4, true) }
	}

	asDecimal128(settings: BSONValueSettings = {}): { $numberDecimal: Uint8Array } {
		if (this.type !== BT.DEC128) {
			throw new Error('Cannot interpret as BSON d128')
		}
		return { $numberDecimal: this.bytes }
	}

	asMinKey(settings: BSONValueSettings = {}): symbol {
		if (this.type !== BT.MIN_KEY) {
			throw new Error('Cannot interpret as BSON MinKey')
		}
		return MinKey
	}

	asMaxKey(settings: BSONValueSettings = {}): symbol {
		if (this.type !== BT.MAX_KEY) {
			throw new Error('Cannot interpret as BSON MaxKey')
		}
		return MaxKey
	}

	asJavaScript(settings: BSONValueSettings = {}): { $code: string } {
		if (this.type !== BT.JS_CODE) {
			throw new Error('Cannot interpret as BSON JavaScript Code')
		}
		return { $code: this.dv.getString(0) }
	}

	asSymbol(settings: BSONValueSettings = {}): { $symbol: string } {
		if (this.type !== BT.SYMBOL) {
			throw new Error('Cannot interpret as BSON Symbol')
		}
		return { $symbol: this.dv.getString(0) }
	}

	asString(settings: BSONValueSettings = {}): string {
		if (this.type !== BT.STRING) {
			throw new Error('Cannot interpret as BSON String')
		}
		return this.dv.getString(0)
	}

	asDocument(settings: BSONValueSettings = {}): BSONDocument {
		if (this.type !== BT.DOCUMENT) {
			throw new Error('Cannot interpret as BSON Document')
		}
		return BSONDocument.from(this.bytes)
	}

	asArray(settings: BSONValueSettings = {}): BSONArray {
		if (this.type !== BT.ARRAY) {
			throw new Error('Cannot interpret as BSON Array')
		}
		return BSONDocument.from(this.bytes, true).asArray()
	}

	asBinary(settings: BSONValueSettings = {}): { $binary: { base64: Uint8Array; subType: number } } {
		if (this.type !== BT.BINARY) {
			throw new Error('Cannot interpret as BSON Binary')
		}
		return { $binary: { base64: this.bytes.subarray(5), subType: this.bytes[4] } }
	}

	asObjectId(settings: BSONValueSettings = {}): { $oid: string } {
		if (this.type !== BT.OID) {
			throw new Error('Cannot interpret as BSON ObjectId')
		}
		return { $oid: bytesToHex(this.bytes) }
	}

	asBoolean(settings: BSONValueSettings = {}): boolean {
		if (this.type !== BT.BOOLEAN) {
			throw new Error('Cannot interpret as BSON Boolean')
		}
		const boolValue = this.dv.getUint8(0)
		if (boolValue !== 0x00 && boolValue !== 0x01) {
			throw new Error(`Boolean must be encoded as a zero or one got: ${boolValue} at ${this.bytes.byteOffset}`)
		}
		return Boolean(boolValue)
	}

	asDate(settings: BSONValueSettings = {}): Date | { $date: { $numberLong: string } } {
		if (this.type !== BT.DATE) {
			throw new Error('Cannot interpret as BSON Date')
		}
		const dateValue = this.dv.getBigInt64(0, true)

		if (settings.style === 'ejson') {
			return { $date: { $numberLong: dateValue.toString() } }
		}

		if (dateValue > MAX_DATE) {
			throw new Error(`Cannot decode date value larger than: ${MAX_DATE} got ${dateValue}`)
		}
		if (dateValue < MIN_DATE) {
			throw new Error(`Cannot decode date value smaller than: ${MIN_DATE} got ${dateValue}`)
		}
		return new Date(Number(dateValue))
	}

	asRegExp(settings: BSONValueSettings = {}): { $regularExpression: { options: string; pattern: string } } {
		if (this.type !== BT.REGEXP) {
			throw new Error('Cannot interpret as BSON RegExp')
		}
		const { length: patternSize, cString: pattern } = this.dv.getCStringAndSize(0)
		const { cString: flags } = this.dv.getCStringAndSize(1 + patternSize)
		return { $regularExpression: { options: flags, pattern } }
	}

	asDBPointer(settings: BSONValueSettings = {}): { $dbPointer: { $id: { $oid: string }; $ref: string } } {
		if (this.type !== BT.DB_POINTER) {
			throw new Error('Cannot interpret as BSON DBPointer')
		}
		const namespaceLength = this.dv.getSize(0)
		const ns = this.dv.getString(0)
		const pointer = {
			// ObjectId
			$oid: this.dv.subarray(namespaceLength + SIZEOF.INT32, SIZEOF.INT32 + SIZEOF.OID + namespaceLength),
		}
		return { $dbPointer: { $id: { $oid: bytesToHex(pointer.$oid) }, $ref: ns } }
	}

	asJavaScriptWithScope(settings: BSONValueSettings = {}): { $code: string; $scope: Record<string, unknown> } {
		if (this.type !== BT.JS_CODE_SCOPE) {
			throw new Error('Cannot interpret as BSON JavaScript With Scope')
		}
		const $code = this.dv.getString(4)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const $scope: Record<string, unknown> = JSON.parse(
			BSONDocument.from(this.bytes.subarray(SIZEOF.INT32 + SIZEOF.INT32 + this.dv.getSize(4))).toEJSON()
		)
		return { $code, $scope }
	}
}

const bsonValueBytes: (type: number, readerIndex: number, dv: BSONDataView) => Uint8Array = (type, readerIndex, dv) => {
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

export interface BSONValueLiteral {
	readonly key: string
	readonly type: number
	readonly bytes: Uint8Array
}

// eslint-disable-next-line func-style
export function* entriesFromBSON(bsonBytes: Uint8Array): Generator<BSONValueLiteral> {
	let dv = new BSONDataView(bsonBytes.buffer, bsonBytes.byteOffset, bsonBytes.byteLength)
	const size = dv.getSize()
	dv = new BSONDataView(bsonBytes.buffer, bsonBytes.byteOffset, size)

	let readerIndex = SIZEOF.INT32

	while (readerIndex < size) {
		const type = dv.getUint8(readerIndex)
		readerIndex += SIZEOF.BYTE

		if (type === 0x00) {
			if (readerIndex < size) {
				throw new Error(`readerIndex=${readerIndex} fell short of the size=${size}`)
			}
			break
		}

		const { length, cString } = dv.getCStringAndSize(readerIndex)
		readerIndex += length + SIZEOF.BYTE

		const bytes = bsonValueBytes(type, readerIndex, dv)

		readerIndex += bytes.byteLength

		yield { bytes, key: cString, type }
	}
}

export class BSONDocument extends Map<string, BSONValueLiteral> {
	[kSize]: number;

	[kBytes]: Uint8Array;

	[kIsArray]: boolean

	constructor() {
		super()
		this[kSize] = 5
		this[kBytes] = new Uint8Array([5, 0, 0, 0, 0])
		this[kIsArray] = false
	}

	static from(bytes: Uint8Array, isArray = false): BSONDocument {
		const map = new BSONDocument()

		if (!(bytes instanceof Uint8Array)) {
			throw new Error('Must provide a Uint8Array')
		}

		const dv = new BSONDataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
		const size = dv.getSize()

		map[kIsArray] = isArray
		map[kSize] = size
		map[kBytes] = bytes

		const entries = entriesFromBSON(bytes)
		for (const bsonEntry of entries) {
			if (isArray) {
				if (!/\d+/u.test(bsonEntry.key)) {
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

	toString(): string {
		const kvStrings = ['BSONDocument {\n']
		for (const [key, value] of this.entries()) {
			kvStrings.push(`  ${key} => ${JSON.stringify(value)}\n`)
		}
		//    [$bytes]=${bytesToHex(this[$bytes])}\n
		kvStrings.push(`  [$size]=${this[kSize]}\n}`)
		return `${kvStrings.join(' ')}`
	}

	inspect(): string {
		return this.toEJSON()
	}

	[Symbol.for('nodejs.util.inspect.custom')](): string {
		return this.inspect()
	}

	toRecord(): Readonly<Record<string, unknown> | unknown[]> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const o: Record<string, unknown> | unknown[] = this[kIsArray] ? new Array<unknown>() : Object.create(null)

		for (const [key, bsonValue] of this.entiresAsBSONValues()) {
			if (key === '__proto__') {
				throw Error('say no to proto')
			} else if (Array.isArray(o)) {
				o[Number(key)] = bsonValue.toNative()
			} else {
				o[key] = bsonValue.toNative()
			}
		}

		return Object.freeze(o)
	}

	toMap(): never {
		throw new Error('borked for now')
		// Return new Map(Array.from(this.entries()).map(([k, v]) => [k, v.toNative()]))
	}

	toEJSON(): string {
		if (this[kIsArray]) {
			return this.asArray().toEJSON()
		}
		const sb = []
		for (const [key, bsonValue] of this.entiresAsBSONValues()) {
			sb.push(`"${key}":${bsonValue.toEJSON()}`)
		}
		return `{${sb.join(',')}}`
	}

	*entiresAsBSONValues(): Generator<[key: string, bsonValue: BSONValue]> {
		for (const [key, { type, bytes }] of this.entries()) {
			yield [key, new BSONValue(type, bytes)]
		}
	}

	asArray(): BSONArray {
		if (!this[kIsArray]) {
			throw new Error(`Document is not an array ${this.toString()}`)
		}
		const array = new BSONArray(this.size)
		for (const [key, value] of this.entiresAsBSONValues()) {
			array[Number(key)] = value
		}
		return array
	}

	[Symbol.species](): typeof BSONDocument {
		return BSONDocument
	}
}

export class BSONArray extends Array<BSONValue> implements ReadonlyArray<BSONValue> {
	toEJSON(): string {
		return `[${Array.from(this.values())
			.map((v) => v.toEJSON())
			.join(',')}]`
	}

	[Symbol.species](): typeof BSONArray {
		return BSONArray
	}
}
