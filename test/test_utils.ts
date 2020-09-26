export function bytesFromHexString(hexString: string): Uint8Array {
	if (hexString.length % 2 !== 0) {
		throw new Error(`Hex strings must have an even length: ${hexString}`)
	}
	const bytes = new Uint8Array(hexString.length / 2)
	for (let i = 0, j = 0; i < hexString.length; i += 2, j++) {
		const byte = hexString.slice(i, i + 2)
		bytes[j] = Number.parseInt(byte, 16)
	}
	return bytes
}
