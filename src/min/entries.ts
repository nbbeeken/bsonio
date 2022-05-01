const byteToHex = (byte: number): string => byte.toString(16).padStart(2, '0')
const bytesToHex = (bytes: Uint8Array): string =>
	Array.from(bytes)
		.map((byte) => byteToHex(byte))
		.join('')

class RawBSONError extends Error {}

const DECODER: { decode: (input: Uint8Array) => string } =
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	TextDecoder == null
		? {
				decode(bytes: Uint8Array): string {
					const continuationMask = 0b00_111111
					const characters: string[] = []

					for (let byteIdx = 0; byteIdx < bytes.byteLength; byteIdx += 1) {
						const byte = bytes[byteIdx]
						if (byte <= 0x7f) {
							characters.push(String.fromCharCode(byte))
						} else if ((byte & 0b1111_0000) === 0b1111_0000) {
							const zerothByte = byte & 0b0000_0111
							const firstByte = bytes[byteIdx + 1] & continuationMask
							const secondByte = bytes[byteIdx + 2] & continuationMask
							const thirdByte = bytes[byteIdx + 3] & continuationMask
							const codePoint = (zerothByte << 18) | (firstByte << 12) | (secondByte << 6) | thirdByte
							characters.push(String.fromCodePoint(codePoint))

							byteIdx += 3
						} else if ((byte & 0b1110_0000) === 0b1110_0000) {
							const zerothByte = byte & 0b0000_1111
							const firstByte = bytes[byteIdx + 1] & continuationMask
							const secondByte = bytes[byteIdx + 2] & continuationMask
							const codePoint = (zerothByte << 12) | (firstByte << 6) | secondByte
							characters.push(String.fromCodePoint(codePoint))

							byteIdx += 2
						} else if ((byte & 0b1100_0000) === 0b1100_0000) {
							const zerothByte = byte & 0b0001_1111
							const firstByte = bytes[byteIdx + 1] & continuationMask
							const codePoint = (zerothByte << 6) | firstByte

							characters.push(String.fromCodePoint(codePoint))

							byteIdx += 1
						} else {
							throw new RawBSONError(`Bad UTF-8 sequence: 0x${byteToHex(byte)}`)
						}
					}

					return characters.join('')
				},
		  }
		: new TextDecoder('utf-8', { fatal: true })

const EMPTY_VALUE = new Uint8Array(Object.freeze(new ArrayBuffer(0)))

const SIZEOF = Object.freeze({
	BYTE: 1,
	D128: 16,
	FLOAT64: 8,
	INT32: 4,
	INT64: 8,
	OID: 12,
})

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

export const BT_LOOKUP = Object.freeze(
	Object.fromEntries(
		Object.entries(BT).map(([typeName, typeByte]: readonly [typeName: string, typeByte: number]) => [
			typeByte,
			typeName,
		])
	)
)

export class BSONDataView extends DataView {
	private readonly uint8view: Uint8Array

	constructor(buffer: ArrayBufferLike, byteOffset: number, byteLength: number) {
		super(buffer, byteOffset, byteLength)
		this.uint8view = new Uint8Array(buffer, byteOffset, byteLength)
	}

	subarray(begin?: number, end?: number): Uint8Array {
		return this.uint8view.subarray(begin, end)
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
		while (this.uint8view[nullTerminatorIndex] !== 0x00) {
			nullTerminatorIndex += 1
		}
		return nullTerminatorIndex - offset
	}

	getCStringAndSize(offset = 0): { length: number; cString: string } {
		let isASCII = true
		const size = this.getCStringLength(offset)
		const chars = new Array(size)
		for (let i = 0; i < size; i += 1) {
			const byte = this.uint8view[i + offset]
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
		if (this.uint8view[nullTerminatorIndex] !== 0x00) {
			throw new Error(`utf8 string must end in 0x00, size=${size}`)
		}
		let isASCII = true
		const chars = new Array(size - 1)
		for (
			let byteIdx = offset + SIZEOF.INT32, charIdx = 0;
			byteIdx < nullTerminatorIndex && charIdx < chars.length;
			charIdx += 1, byteIdx += 1
		) {
			const byte = this.uint8view[byteIdx]
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
		const seq = this.uint8view.subarray(offset, offset + 4 + size)
		return seq
	}

	getBigUint128(offset = 0, littleEndian = false): bigint {
		if (littleEndian) {
			const low = this.getBigUint64(offset, true)
			const high = this.getBigUint64(offset + 8, true)
			return (high << 64n) | low
		}
		const high = this.getBigUint64(offset, false)
		const low = this.getBigUint64(offset + 8, false)
		return (high << 64n) | low
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

export interface BSONEntry {
	readonly bytes: Uint8Array
	readonly index: number
	readonly key: string
	readonly type: number
}

// eslint-disable-next-line func-style
export function* entriesFromBSON(bsonBytes: Uint8Array): Generator<BSONEntry, null> {
	if (bsonBytes.byteLength < 5) {
		throw new RawBSONError('buffer must contain at least 5 bytes')
	}

	const size = bsonBytes[0] | (bsonBytes[1] << 8) | (bsonBytes[2] << 16) | (bsonBytes[3] << 24)
	if (size < 5 || size > 0x7fff_ffff) {
		throw new RawBSONError('size must be larger than 5 and less than Int32.max')
	}

	const dv = new BSONDataView(bsonBytes.buffer, bsonBytes.byteOffset, size)

	let readerIndex = SIZEOF.INT32

	let index = 0

	while (readerIndex < size) {
		const type = bsonBytes[readerIndex]
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

		yield {
			key: cString,
			type,
			bytes,
			index,
			/*
			 * ```ts
			 * [Symbol.for('nodejs.util.inspect.custom')](): string {
			 *   const hex = bytesToHex(this.bytes)
			 *   return (
			 *     `{ key: "${this.key}", type: ${BT_LOOKUP[this.type]}(${this.type}), ` +
			 *     `bytes: "${hex}", index: ${this.index} }`
			 *   )
			 * },
			 * ```
			 */
		}
		index += 1
	}

	return null
}

export type BSONEntryTuple = [key: string, bsonValue: BSONEntry]

export function* mappedEntriesFromBSON(bsonBytes: Uint8Array): Generator<BSONEntryTuple, null> {
	const entriesGenerator = entriesFromBSON(bsonBytes)
	let nextEntry = entriesGenerator.next()
	while (nextEntry.done !== true) {
		yield [nextEntry.value.key, nextEntry.value]
		nextEntry = entriesGenerator.next()
	}
	return null
}
