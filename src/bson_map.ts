const UTF8_DECODER = new TextDecoder('utf8', { fatal: true })
const UTF8_ENCODER = new TextEncoder()
const BSON_TYPE = Symbol('bson.type')

export const TYPE = Object.freeze({
	DOUBLE: 0x01,
	STRING: 0x02,
	DOCUMENT: 0x03,
	ARRAY: 0x04,
	BINARY: 0x05,
	UNDEFINED: 0x06,
	OBJECTID: 0x07,
	BOOLEAN: 0x08,
	UTC_DATE: 0x09,
	NULL: 0x0a,
	REGEX: 0x0b,
	DB_POINTER: 0x0c,
	CODE: 0x0d,
	SYMBOL: 0x0e,
	CODE_WITH_SCOPE: 0x0f,
	INT32: 0x10,
	TIMESTAMP: 0x11,
	INT64: 0x12,
	DECIMAL128: 0x13,
	MIN_KEY: 0xff,
	MAX_KEY: 0x7f,

	[0x01]: 'DOUBLE',
	[0x02]: 'STRING',
	[0x03]: 'DOCUMENT',
	[0x04]: 'ARRAY',
	[0x05]: 'BINARY',
	[0x06]: 'UNDEFINED',
	[0x07]: 'OBJECTID',
	[0x08]: 'BOOLEAN',
	[0x09]: 'UTC_DATE',
	[0x0a]: 'NULL',
	[0x0b]: 'REGEX',
	[0x0c]: 'DB_POINTER',
	[0x0d]: 'CODE',
	[0x0e]: 'SYMBOL',
	[0x0f]: 'CODE_WITH_SCOPE',
	[0x10]: 'INT32',
	[0x11]: 'TIMESTAMP',
	[0x12]: 'INT64',
	[0x13]: 'DECIMAL128',
	[0xff]: 'MIN_KEY',
	[0x7f]: 'MAX_KEY',

	getTypeName(typeNumber: number): string {
		//@ts-expect-error
		return this[typeNumber]
	}
} as const)

type Entries = readonly (readonly [string, any])[]

interface BSONValueDescriptor extends PropertyDescriptor {
	[BSON_TYPE]: string
}

export class BSONMap extends Map<string, any> {

	constructor(buffer: ArrayBuffer, options: any = {}) {
		if (!(buffer instanceof ArrayBuffer)) {
			throw new TypeError('BSONMap can only be constructed from ArrayBuffer')
		}
		const { entries } = BSONMap.parse(new Uint8Array(buffer), options)
		super(entries)
	}

	getBSONValue(key: string) {
		const value = super.get(key)
		if (typeof value === 'undefined' || value === null) {
			throw new TypeError('BSONValue does not exist')
		}
		return value
	}

	toBSON(): Uint8Array {
		return new Uint8Array([0, 0, 0, 5, 0])
	}

	toObject(): Record<string, any> {
		const document = Object.create(null)
		for (const [key, bsonValueDescriptor] of this) {
			Reflect.defineProperty(document, key, bsonValueDescriptor)
		}
		Reflect.defineProperty(document, Symbol.toStringTag, { value: () => 'BSONDocument', enumerable: false, writable: false, configurable: false })
		return document
	}

	private static parse(sequence: Uint8Array, options: any, offset = 0): { entries: Entries, documentByteLength: number } {
		const entries: [string, any][] = []
		const view = new DataView(sequence.buffer, offset)
		let index = 0

		const documentSize = view.getInt32(index, true)
		index += 4

		let position = 0
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

			const { cString: key, size: keySize } = BSONMap.getCString(sequence, index)
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
				case TYPE.SYMBOL:
				case TYPE.CODE:
				case TYPE.STRING: {
					const stringLength = view.getInt32(index, true)
					index += 4
					value = BSONMap.getString(sequence, index, stringLength)
					index += stringLength
					break
				}
				case TYPE.DOCUMENT: {
					const { entries, documentByteLength } = BSONMap.parse(sequence.subarray(index), options, index)
					index += documentByteLength
					value = entries
					break
				}
				case TYPE.ARRAY: {
					const { entries, documentByteLength } = BSONMap.parse(sequence.subarray(index), options, index)
					index += documentByteLength
					value = entries.map(([, value]) => value)
					break
				}
				case TYPE.BINARY: {
					const binSize = view.getInt32(index, true)
					index += 4
					const binType = view.getUint8(index)
					index += 1
					const binSequence = sequence.subarray(index, index + binSize)
					index += binSize
					value = { binSequence, binSize, binType }
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
					throw new Error(`Unsupported type 0x${type.toString(16)} - ${TYPE.getTypeName(type)}`)
					break
				}
				case TYPE.DB_POINTER: {
					throw new Error(`Unsupported type 0x${type.toString(16)} - ${TYPE.getTypeName(type)}`)
					break
				}
				case TYPE.CODE_WITH_SCOPE: {
					// code
					const stringLength = view.getInt32(index, true)
					index += 4
					const code = BSONMap.getString(sequence, index, stringLength)
					index += stringLength
					// scope
					const { entries, documentByteLength } = BSONMap.parse(sequence.subarray(index), options, index)
					index += documentByteLength
					const scope = entries

					value = { code, scope }
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
					throw new Error(`Unsupported type 0x${type.toString(16)} - ${TYPE.getTypeName(type)}`)
					break
				}
				case TYPE.MIN_KEY: {
					throw new Error(`Unsupported type 0x${type.toString(16)} - ${TYPE.getTypeName(type)}`)
					break
				}
				case TYPE.MAX_KEY: {
					throw new Error(`Unsupported type 0x${type.toString(16)} - ${TYPE.getTypeName(type)}`)
					break
				}
				default:
					throw new Error(`Unsupported type 0x${type.toString(16)} at ${offset + index}: ${BSONMap.toHexString(sequence)}`)
			}
			entries.push([key, { value, position: position++, [BSON_TYPE]: TYPE.getTypeName(type), configurable: false, writable: !!options.writable, enumerable: true }])
		}
		return { entries, documentByteLength: documentSize }
	}

	private static getCString(sequence: Uint8Array, index: number) {
		let nullTerm = index
		for (; nullTerm < 256; nullTerm++) {
			if (sequence[nullTerm] === 0) break
		}

		const cString = UTF8_DECODER.decode(sequence.slice(index, nullTerm))

		return { cString, size: nullTerm - index + 1 }

	}

	private static getString(sequence: Uint8Array, index: number, size: number) {
		return UTF8_DECODER.decode(sequence.subarray(index, index + size - 1))
	}

	private static toHexString(buffer: Uint8Array): string {
		return Array.from(buffer).map(v => `${v.toString(16).padStart(2, '0').toUpperCase()}`).join(' ')
	}
}

// var s = "F4010000075F69640057E193D7A9CC81B4027498B502537472696E670007000000737472696E670010496E743332002A00000012496E743634002A0000000000000001446F75626C6500000000000000F0BF0542696E617279001000000003A34C38F7C3ABEDC8A37814A992AB8DB60542696E61727955736572446566696E656400050000008001020304050D436F6465000E00000066756E6374696F6E2829207B7D000F436F64655769746853636F7065001B0000000E00000066756E6374696F6E2829207B7D00050000000003537562646F63756D656E74001200000002666F6F0004000000626172000004417272617900280000001030000100000010310002000000103200030000001033000400000010340005000000001154696D657374616D7000010000002A0000000B5265676578007061747465726E0000094461746574696D6545706F6368000000000000000000094461746574696D65506F73697469766500FFFFFF7F00000000094461746574696D654E656761746976650000000080FFFFFFFF085472756500010846616C73650000034442526566003D0000000224726566000B000000636F6C6C656374696F6E00072469640057FD71E96E32AB4225B723FB02246462000900000064617461626173650000FF4D696E6B6579007F4D61786B6579000A4E756C6C0000"
var s = '1a 00 00 00 10 61 00 01 00 00 00 10 62 00 02 00 00 00 10 63 00 03 00 00 00 00'.split(' ').join('')
var hex = []
for (let i = 0; i < s.length; i += 2) {
	var digits = s[i] + s[i + 1]
	hex.push(Number.parseInt(digits, 16))
}
var u = new Uint8Array(hex)
var b = new BSONMap(u.buffer)
console.log(b)
var o = b.toObject()
console.log(o)
o.a = 4
delete o.b
console.log(Object.getOwnPropertyDescriptors(o))
