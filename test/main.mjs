import { BSONDocument } from '../src/mod.mjs'

const inspect = (object) => {
	return JSON.stringify(object, (k, val) => {
		if (typeof val === 'bigint') return val.toString() + 'n'
		if (ArrayBuffer.isView(val)) return { $buffer: toHexString(val) }
		if (val instanceof Map) return val.toRecord()
		if (val === undefined) return "undef"
		return val
	}, 2)
}

/**
 * @param {string} utf16String
 * @returns {Uint8Array}
 */
const encode_utf8 = (utf16String) => new Uint8Array(Array.from(unescape(encodeURIComponent(utf16String))).map(c => c.charCodeAt(0)))

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
const decode_utf8 = (bytes) => decodeURIComponent(escape(Array.from(bytes).map(b => String.fromCharCode(b)).join('')))


function toHexString(buffer) {
	const hex = []
	for (let i = 0; i < buffer.length; i += 1) {
		const byte = buffer[i]
		hex.push(byte.toString(16).padStart(2, '0'))
	}
	return hex.join('')
}

/**
 * A helper to calculate the byte size of a string (including null)
 *
 * ```js
 * const x = stringToUTF8HexBytes('ab') // { x: '03000000616200' }
 *
 * @param string - representing what you want to encode into BSON
 * @returns BSON string with byte size encoded
 */
const stringToUTF8HexBytes = str => {
	const b = encode_utf8(str)
	const len = b.byteLength
	const ab = new ArrayBuffer(len + 4 + 1)
	const out = new Uint8Array(ab)
	const dv = new DataView(ab)
	dv.setInt32(0, len + 1, true)
	out.set(b, 4)
	out[len + 4 + 1] = 0x00
	return toHexString(out)
}

/**
 * A helper to turn hex string sequences into BSON.
 * Omit the first 8 hex digits for the document it will be calculated
 * As well as the BSON document's null terminator '00'
 *
 * @example
 * ```js
 * const bytes = bufferFromHexArray([
 *   '10', // int32 type
 *   '6100', // 'a' key with key null terminator
 *   '01000000' // little endian int32
 * ])
 * BSON.serialize(bytes) // { a: 1 }
 * ```
 *
 * @param {string[]} array - sequences of hex digits broken up to be human readable
 * @returns
 */
const bufferFromHexArray = array => {
	const string = array.concat(['00']).join('')
	const size = string.length / 2 + 4

	const byteLength = [size & 0xff, (size >> 8) & 0xff, (size >> 16) & 0xff, (size >> 24) & 0xff]
		.map(n => {
			const hexCode = n.toString(16)
			return hexCode.length === 2 ? hexCode : '0' + hexCode
		})
		.join('')

	const hex = byteLength + string

	const a = new Uint8Array(size)
	for (let i = 0, j = 0; i < hex.length; i += 2, j++) {
		const byte = parseInt(`${hex[i]}${hex[i + 1]}`, 16)
		a[j] = byte
	}
	return a
}


// const map = new BSONDocument()
// // print(map)
const buf = bufferFromHexArray([
	'10', // int32 type
	'6100', // 'a' key with key null terminator
	'01000000', // little endian int32
	'08', // bool type
	'6200', // 'b' key with key null terminator
	'01', // true -false

	'03', // doc
	'6300', // 'c'
	toHexString(bufferFromHexArray([
		'10', // int32 type
		'6100', // 'a' key with key null terminator
		'01000000', // little endian int32
		'08', // bool type
		'6200', // 'b' key with key null terminator
		'01', // true
	])),

	'04', // array
	'6400', // 'd'
	toHexString(bufferFromHexArray([
		'10', // int32 type
		'3000', // 'a' key with key null terminator
		'01000000', // little endian int32
		'08', // bool type
		'3100', // 'b' key with key null terminator
		'01', // true
	])),

	'02',
	'6500',
	...stringToUTF8HexBytes('idea'),

	'06',
	'6600',
	'0A',
	'6700',

	'FF',
	'6800',
	'7F',
	'6900',

	'01',
	'6A00',
	'AE47E17A14AEF33F',

	'12',
	'6B00',
	'7C112097FAFFFFFF',

	'11',
	'6C00',
	'7C112097FAFFFFFF',

	'13',
	'6D00',
	'7b000000000000000000000000003c30',

	'05',
	'6E00',
	...[
		'10000000',
		'04',
		'F4B7D6E1D9134F388BC69A473B41CB6E'
	],

	'07',
	'6F00',
	'0102030405060708090A0B0C',

	'0b',
	'7000',
	'61626300', '696d7800',

	'09',
	'7100',
	'001EB208C2DC0000',

	'0C',
	'7200',
	...stringToUTF8HexBytes('ns'), '0102030405060708090A0B0C',

	'0F',
	'7300',
	...['1D000000',
		...['09000000', '2829203D3E207B7D00'],
		...['0C000000', '1061000100000000']
	],

	'02',
	'7400',
	...stringToUTF8HexBytes('😁'), // 0xf0, 0x9f, 0x98, 0x81

	'10',
	'75F09F988100',
	'01000000', // 0xf0, 0x9f, 0x98, 0x81
])

const doc = BSONDocument.from(buf)
// console.log(doc)
// const rec = doc.toRecord()
// console.log(inspect(rec))
console.log(doc.toMap())
