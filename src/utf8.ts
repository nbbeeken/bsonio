const continuationMask = 0b00_111111

export class UTF8Decoder {
    encoding: 'utf-8'
    ignoreBOM: boolean
    fatal: boolean

    constructor() {
        this.encoding = 'utf-8'
        this.ignoreBOM = false
        this.fatal = true
    }

    decode(bytes: Uint8Array) {
        const characters: string[] = []

        for (let byteIdx = 0; byteIdx < bytes.byteLength; byteIdx++) {
            const byte = bytes[byteIdx]
            if (byte <= 0x7F) {
                characters.push(String.fromCharCode(byte))
            } else {
                if ((byte & 0b1111_0000) === 0b1111_0000) {
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
                    throw TypeError(`Bad UTF-8 sequence: 0x${byte.toString(16).padStart(2, '0')}`)
                }
            }
        }

        return characters.join('')
    }
}
