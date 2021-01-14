import { BSON_TYPE_MAP } from './bson_types.js'
import { TYPE } from './constants.js'
import { BSONDocument } from './parser.js'

export const INT64_MAX = BigInt('0x7FFFFFFFFFFFFFFF')

export class BSONValue {
	private _bytes?: Uint8Array
	private _value: any
	// private isStale: boolean
	constructor(public type: TYPE, value: any, bytes?: Uint8Array) {
		if (bytes) {
			this._bytes = bytes
		}
		this._value = value
	}

	get bytes() {
		if (!this._bytes) this._bytes = this.valueToBytes()
		return this._bytes
	}

	get size() {
		if (!this._bytes) this._bytes = this.valueToBytes()
		return this._bytes.byteLength
	}

	get value() {
		return this._value
	}

	set value(value: any) {
		// this.isStale = true
		this._value = value
	}

	private valueToBytes(): Uint8Array {
		switch (this.type) {
			case TYPE.BOOLEAN:
				return new Uint8Array([this.value ? 0x01 : 0x00])
			case TYPE.DECIMAL128:
				// prettier-ignore
				return new Uint8Array([0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
			case TYPE.DOUBLE:
				return new Uint8Array(new Float64Array([this.value]).buffer)
			case TYPE.UTC_DATE:
			case TYPE.INT64:
				return new Uint8Array(new BigInt64Array([BigInt(this.value)]).buffer)
			case TYPE.TIMESTAMP:
				return new Uint8Array(new BigUint64Array([BigInt(this.value)]).buffer)
			case TYPE.INT32:
				return new Uint8Array(new Int32Array([this.value]).buffer)

			case TYPE.OBJECTID:
				return this.value

			case TYPE.UNDEFINED:
			case TYPE.NULL:
			case TYPE.MIN_KEY:
			case TYPE.MAX_KEY:
				return new Uint8Array(0)

			case TYPE.STRING:
				const stringBytes = encoder.encode(this.value + '\x00')
				return new Uint8Array([...new Uint8Array(new Int32Array([stringBytes.byteLength]).buffer), ...stringBytes])

			default:
				throw new Error(`TODO: Add type size calculations ${this.type}`)
		}
	}

	static from(value: any, { readBytes, typeOverride }: { readBytes?: Uint8Array; typeOverride?: TYPE } = {}) {
		let type
		let size = -1
		let bytes = null

		if (typeOverride !== undefined) {
			return new BSONValue(typeOverride, value)
		}

		switch (typeof value) {
			case 'number':
				if (Number.isInteger(value)) {
					if (value < 0x7fff_ffff) {
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
				bytes = encoder.encode(value.description + '\x00')
				size = bytes.byteLength + 4
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
				} else if ('_bsontype' in value) {
					type = BSON_TYPE_MAP.get(value._bsontype)!.type
					size = value = value.value
				} else if (value instanceof RegExp) {
					type = TYPE.REGEX
					value = { regex: value, flags: '' }
				} else if (value instanceof Date) {
					type = TYPE.UTC_DATE
				} else if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
					type = TYPE.BINARY
				} else if (value instanceof BSONDocument) {
					type = TYPE.DOCUMENT
					size = value.documentByteLength
				} else {
					type = TYPE.DOCUMENT
					value = convertPOJOtoMap(value)
				}
				break
			default:
				// really unexpected
				throw new Error(`Unable to handle type: ${typeof value}`)
		}
		return new BSONValue(type, value)
	}
}

/**
 * Convert a Plain Javascript Object to a map with typing information.
 * @param document - a simple js object
 */
function convertPOJOtoMap(document: Record<string, any>) {
	const map = new BSONDocument(new Uint8Array())
	map.isStale = true // TODO: always run through the parser
	for (const [key, value] of Object.entries(document)) {
		map.set(key, BSONValue.from(value))
	}
	return map
}

export class BSONError extends Error { }

const encoder = new TextEncoder()

export function bytesify(pojo?: Record<string, any> | null) {
	if (pojo === undefined || pojo === null) {
		throw new BSONError('Cannot bytesify undefined or null.')
	}
	return bytesFromMap(convertPOJOtoMap(pojo))
}

export function bytesFromMap(map: BSONDocument) {
	if (map.bytesSequence && !map.isStale) {
		return map.bytesSequence
	}
	const documentSize = calculateDocumentSize(map)
	const array = new Uint8Array(documentSize)
	const view = new DataView(array.buffer)
	view.setInt32(0, documentSize, true)
	let index = 4

	for (const [key, descriptor] of map.entries()) {
		array[index] = descriptor.type
		index += 1
		index += writeCString(array, index, key)
		array.set(descriptor.bytes, index)
		index += descriptor.size
	}

	return array
}

function utf8StringLength(str: string) {
	return encoder.encode(str).byteLength
}

function calculateDocumentSize(map: Map<string, BSONValue>) {
	let documentSize = 5
	for (const [key, value] of map.entries()) {
		documentSize += utf8StringLength(key) + 1 // null terminator
		documentSize += 1 // type indicator
		documentSize += value.bytes.byteLength
	}
	return documentSize
}

function writeCString(buffer: Uint8Array, index: number, cString: string) {
	const keyAsBytes = encoder.encode(cString)
	buffer.set(keyAsBytes, index)
	buffer.set([0], index + keyAsBytes.length + 1)
	return keyAsBytes.length + 1
}
