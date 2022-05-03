import { RawBSONError } from './error.js'
import { UTF8_DECODER } from './utf8.js'

const byteToHex = (byte: number): string => byte.toString(16).padStart(2, '0')
const bytesToHex = (bytes: Uint8Array): string =>
	Array.from(bytes)
		.map((byte) => byteToHex(byte))
		.join('')

const SIZEOF_BYTE = 1
const SIZEOF_D128 = 16
const SIZEOF_DBL64 = 8
const SIZEOF_INT32 = 4
const SIZEOF_INT64 = 8
const SIZEOF_OID = 12
const NULL_TERMINATOR = 0x00
const ASCII_MAX = 0x7f
const BSON_MIN_SIZE = 5
const BSON_MAX_SIZE = 0x7fff_ffff

const TYPE_DOUBLE = 0x01
const TYPE_STRING = 0x02
const TYPE_DOCUMENT = 0x03
const TYPE_ARRAY = 0x04
const TYPE_BINDATA = 0x05
const TYPE_UNDEFINED = 0x06
const TYPE_OBJECTID = 0x07
const TYPE_BOOL = 0x08
const TYPE_DATE = 0x09
const TYPE_NULL = 0x0a
const TYPE_REGEX = 0x0b
const TYPE_DBPOINTER = 0x0c
const TYPE_JAVASCRIPT = 0x0d
const TYPE_SYMBOL = 0x0e
const TYPE_JAVASCRIPTWITHSCOPE = 0x0f
const TYPE_INT = 0x10
const TYPE_TIMESTAMP = 0x11
const TYPE_LONG = 0x12
const TYPE_DECIMAL = 0x13
const TYPE_MINKEY = 0xff
const TYPE_MAXKEY = 0x7f

const EMPTY_VALUE = new Uint8Array(Object.freeze(new ArrayBuffer(0)))

export class BSONDataView extends DataView {
	uint8array: Uint8Array

	constructor(uint8array: Uint8Array, byteOffset?: number, byteLength?: number) {
		super(uint8array.buffer, byteOffset ?? uint8array.byteOffset, byteLength ?? uint8array.byteLength)
		this.uint8array = uint8array
	}

	subarray(begin: number, end: number): Uint8Array {
		return this.uint8array.subarray(begin, end)
	}

	getSize(offset: number): number {
		const size = this.getInt32(offset, true)
		if (size < 0) {
			throw new Error(`Size must be positive, got ${size}`)
		}
		return size
	}

	getCStringLength(offset: number): number {
		let nullTerminatorIndex = offset
		while (this.uint8array[nullTerminatorIndex] !== NULL_TERMINATOR) {
			nullTerminatorIndex += SIZEOF_BYTE
		}
		return nullTerminatorIndex - offset
	}

	getCStringAndLength(offset: number): { length: number; cString: string } {
		let isASCII = true
		const size = this.getCStringLength(offset)
		const chars = new Array(size)
		for (let i = 0; i < size; i += SIZEOF_BYTE) {
			const byte = this.uint8array[i + offset]
			if (byte > ASCII_MAX) {
				isASCII = false
				break
			}
			chars[i] = String.fromCharCode(byte)
		}
		if (isASCII) {
			return { cString: chars.join(''), length: chars.length }
		}
		const seq = this.subarray(offset, offset + size)
		return { cString: UTF8_DECODER.decode(seq), length: seq.byteLength }
	}

	/** Returns a view on based on the LE int32 written at the offset.*/
	getSizedSequence(offset: number): Uint8Array {
		const size = this.getSize(offset)
		const seq = this.uint8array.subarray(offset, offset + SIZEOF_INT32 + size)
		return seq
	}
}

export interface BSONEntry {
	readonly key: string
	readonly type: number
	readonly bytes: Uint8Array
	readonly index: number
}

export function* entriesFromBSON(bsonBytes: Uint8Array): Generator<BSONEntry, number> {
	if (bsonBytes.byteLength < BSON_MIN_SIZE) {
		throw new RawBSONError('buffer must contain at least 5 bytes')
	}

	const size = bsonBytes[0] | (bsonBytes[1] << 8) | (bsonBytes[2] << 16) | (bsonBytes[3] << 24)
	if (size < BSON_MIN_SIZE || size > BSON_MAX_SIZE) {
		throw new RawBSONError('size must be larger than 5 and less than Int32.max')
	}

	const dv = new BSONDataView(bsonBytes, bsonBytes.byteOffset, size)

	let readerIndex = SIZEOF_INT32
	let index = 0

	while (readerIndex < size) {
		const type = bsonBytes[readerIndex]
		readerIndex += SIZEOF_BYTE

		if (type === NULL_TERMINATOR) {
			if (readerIndex < size) {
				throw new RawBSONError(`readerIndex=${readerIndex} fell short of the size=${size}`)
			}
			break
		}

		const { length, cString: key } = dv.getCStringAndLength(readerIndex)
		readerIndex += length + SIZEOF_BYTE

		let offset = 0

		switch (type) {
			case TYPE_OBJECTID:
				offset = SIZEOF_OID
				break

			case TYPE_NULL:
			case TYPE_UNDEFINED:
			case TYPE_MINKEY:
			case TYPE_MAXKEY:
				offset = 0
				break

			case TYPE_INT:
				offset = SIZEOF_INT32
				break

			case TYPE_DOUBLE:
				offset = SIZEOF_DBL64
				break

			case TYPE_LONG:
			case TYPE_DATE:
			case TYPE_TIMESTAMP:
				offset = SIZEOF_INT64
				break

			case TYPE_DECIMAL:
				offset = SIZEOF_D128
				break

			case TYPE_BOOL:
				offset = SIZEOF_BYTE
				break

			case TYPE_SYMBOL:
			case TYPE_STRING:
			case TYPE_JAVASCRIPT:
				offset = dv.getSize(readerIndex) + SIZEOF_INT32
				break

			case TYPE_DOCUMENT:
			case TYPE_ARRAY:
			case TYPE_JAVASCRIPTWITHSCOPE:
				offset = dv.getSize(readerIndex)
				break

			case TYPE_BINDATA:
				offset = SIZEOF_INT32 + SIZEOF_BYTE + dv.getSize(readerIndex)
				break

			case TYPE_DBPOINTER:
				offset = SIZEOF_INT32 + SIZEOF_OID + dv.getSize(readerIndex)
				break

			case TYPE_REGEX: {
				// REGEXP
				const patternSize = dv.getCStringLength(readerIndex)
				const flagsSize = dv.getCStringLength(readerIndex + SIZEOF_BYTE + patternSize)
				offset = patternSize + flagsSize + SIZEOF_BYTE + SIZEOF_BYTE
				break
			}

			default:
				throw new RawBSONError(`No Parser for 0x${byteToHex(type)} off: ${readerIndex}`)
		}

		const bytes = offset === 0 ? EMPTY_VALUE : bsonBytes.subarray(readerIndex, readerIndex + offset)
		readerIndex += offset

		yield { key, type, bytes, index }
		index += 1
	}
	return index
}

export type BSONEntryTuple = [key: string, bsonValue: BSONEntry]

export function* mappedEntriesFromBSON(bsonBytes: Uint8Array): Generator<BSONEntryTuple, number> {
	const entriesGenerator = entriesFromBSON(bsonBytes)
	let nextEntry = entriesGenerator.next()
	while (nextEntry.done !== true) {
		yield [nextEntry.value.key, nextEntry.value]
		nextEntry = entriesGenerator.next()
	}
	return nextEntry.value
}

const mdbBsonBsonEntry: unique symbol = Symbol.for('@@mdb.bson.bsonEntry')
class BSONArray extends Array {
	[mdbBsonBsonEntry]: BSONEntry
}
export function bsonDocument(
	bsonBytes: Uint8Array,
	transform?: (entry: BSONEntry | null, parent: any, root: any) => any
): any {
	const root: Record<string, unknown> = {
		[Symbol.for('@@mdb.bson.bsonEntry')]: {
			key: '\0',
			type: TYPE_DOCUMENT,
			bytes: bsonBytes,
			index: -1,
		},
	}
	const output: any[] = [root]
	const stack = [entriesFromBSON(bsonBytes)]

	while (stack.length !== 0) {
		let it = null
		do {
			const currentGenerator = stack[stack.length - 1]
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const currentOutput: any = output[output.length - 1]

			it = currentGenerator.next()

			if (it.done !== true) {
				const entry = it.value

				if (entry.type === TYPE_DOCUMENT) {
					const newNested = { [Symbol.for('@@mdb.bson.bsonEntry')]: entry }
					currentOutput[entry.key] = newNested
					output.push(newNested)
					stack.push(entriesFromBSON(entry.bytes))
				} else if (entry.type === TYPE_ARRAY) {
					const newNested: any[] = Object.assign([], { [Symbol.for('@@mdb.bson.bsonEntry')]: entry })
					currentOutput[entry.key] = newNested
					output.push(newNested)
					stack.push(entriesFromBSON(entry.bytes))
				} else if (entry.type === TYPE_JAVASCRIPTWITHSCOPE) {
					const newNested = { [Symbol.for('@@mdb.bson.bsonEntry')]: entry }
					const dv = new BSONDataView(entry.bytes)
					currentOutput[entry.key] = {
						code: dv.getSizedSequence(4),
						scope: newNested,
					}
					output.push(newNested)
					const codeLength = dv.getSize(4)
					stack.push(entriesFromBSON(entry.bytes.subarray(SIZEOF_INT32 + SIZEOF_INT32 + codeLength)))
				} else {
					let finalEntry = entry
					if (transform) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						finalEntry = transform(entry, null, null)
					}
					output[output.length - 1][entry.key] = finalEntry
				}
			}
		} while (it.done !== true)

		stack.pop()
		const parent = output.pop()

		if (transform) {
			const entry = parent[Symbol.for('@@mdb.bson.bsonEntry')]
			delete parent[Symbol.for('@@mdb.bson.bsonEntry')]
			if (output.length === 0) {
				transform(null, null, parent)
			} else {
				const result = transform(null, parent, null)
				output[output.length - 1][entry.key] = result
			}
		}
	}

	return root
}
