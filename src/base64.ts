const lookup: string[] = []
const revLookup: number[] = []
const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

for (let index = 0, len = code.length; index < len; index += 1) {
	lookup[index] = code[index]
	revLookup[code.charCodeAt(index)] = index
}

/*
 * Support decoding URL-safe base64 strings, as Node.js does.
 * See: https://en.wikipedia.org/wiki/Base64#URL_applications
 */
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

const getLens = (b64: string) => {
	const len = b64.length

	if (len % 4 > 0) {
		throw new Error('Invalid string. Length must be a multiple of 4')
	}

	/*
	 * Trim off extra bytes after placeholder bytes are found
	 * See: https://github.com/beatgammit/base64-js/issues/42
	 */
	let validLen = b64.indexOf('=')
	if (validLen === -1) {
		validLen = len
	}

	const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4)

	return [validLen, placeHoldersLen]
}

const byteLengthCalculation = (validLen: number, placeHoldersLen: number) =>
	((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen

// Base64 is 4/3 + up to two characters of the original data
const byteLength = (b64: string) => {
	const lens = getLens(b64)
	const [validLen, placeHoldersLen] = lens
	return byteLengthCalculation(validLen, placeHoldersLen)
}

const toByteArray = (b64: string) => {
	let tmp = 0
	const lens = getLens(b64)
	const [validLen, placeHoldersLen] = lens
	const arr = new Uint8Array(byteLengthCalculation(validLen, placeHoldersLen))

	let curByte = 0

	// If there are placeholders, only get up to the last complete 4 chars
	const len = placeHoldersLen > 0 ? validLen - 4 : validLen

	let index = 0
	for (index = 0; index < len; index += 4) {
		tmp =
			(revLookup[b64.charCodeAt(index)] << 18) |
			(revLookup[b64.charCodeAt(index + 1)] << 12) |
			(revLookup[b64.charCodeAt(index + 2)] << 6) |
			revLookup[b64.charCodeAt(index + 3)]
		arr[curByte] = (tmp >> 16) & 0xff
		curByte += 1
		arr[curByte] = (tmp >> 8) & 0xff
		curByte += 1
		arr[curByte] = tmp & 0xff
		curByte += 1
	}

	if (placeHoldersLen === 2) {
		tmp = (revLookup[b64.charCodeAt(index)] << 2) | (revLookup[b64.charCodeAt(index + 1)] >> 4)
		arr[curByte] = tmp & 0xff
		curByte += 1
	}

	if (placeHoldersLen === 1) {
		tmp =
			(revLookup[b64.charCodeAt(index)] << 10) |
			(revLookup[b64.charCodeAt(index + 1)] << 4) |
			(revLookup[b64.charCodeAt(index + 2)] >> 2)
		arr[curByte] = (tmp >> 8) & 0xff
		curByte += 1
		arr[curByte] = tmp & 0xff
		curByte += 1
	}

	return arr
}

const tripletToBase64 = (num: number) =>
	lookup[(num >> 18) & 0x3f] + lookup[(num >> 12) & 0x3f] + lookup[(num >> 6) & 0x3f] + lookup[num & 0x3f]

const encodeChunk = (uint8: Uint8Array, start: number, end: number) => {
	let tmp = 0
	const output = []
	for (let index = start; index < end; index += 3) {
		tmp = ((uint8[index] << 16) & 0xff0000) + ((uint8[index + 1] << 8) & 0xff00) + (uint8[index + 2] & 0xff)
		output.push(tripletToBase64(tmp))
	}
	return output.join('')
}

const fromByteArray = (uint8: Uint8Array) => {
	let tmp = 0
	const len = uint8.length
	// If we have 1 byte left, pad 2 bytes
	const extraBytes = len % 3
	const parts = []
	// Must be multiple of 3
	const maxChunkLength = 16383

	// Go through the array every three bytes, we'll deal with trailing stuff later
	for (let index = 0, len2 = len - extraBytes; index < len2; index += maxChunkLength) {
		parts.push(encodeChunk(uint8, index, index + maxChunkLength > len2 ? len2 : index + maxChunkLength))
	}

	// Pad the end with zeros, but make sure to not forget the extra bytes
	if (extraBytes === 1) {
		tmp = uint8[len - 1]
		parts.push(`${lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f]}==`)
	} else if (extraBytes === 2) {
		tmp = (uint8[len - 2] << 8) + uint8[len - 1]
		parts.push(`${lookup[tmp >> 10] + lookup[(tmp >> 4) & 0x3f] + lookup[(tmp << 2) & 0x3f]}=`)
	}

	return parts.join('')
}

export const BASE64 = { byteLength, fromByteArray, toByteArray }
