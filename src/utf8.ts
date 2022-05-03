import { RawBSONError } from './error.js'

export const UTF8_DECODER: { decode: (input: Uint8Array) => string } =
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	true
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
							throw new RawBSONError(`Bad UTF-8 sequence: 0x${byte}`)
						}
					}

					return characters.join('')
				},
		  }
		: new TextDecoder('utf-8', { fatal: true })
