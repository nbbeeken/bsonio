import { BSONDocument } from "../src/mod.mjs";
import { readFile } from 'fs/promises'

const PATH = './test/bench-data/'

const e = new TextEncoder()

export function toHexString(buffer) {
    const hex = []
    for (let i = 0; i < buffer.length; i += 1) {
        const byte = buffer[i]
        hex.push(byte.toString(16).padStart(2, '0'))
    }
    return hex.join('')
}

export const stringToUTF8HexBytes = str => {
    const b = e.encode(str)
    const len = b.byteLength
    const ab = new ArrayBuffer(len + 4 + 1)
    const out = new Uint8Array(ab)
    const dv = new DataView(ab)
    dv.setInt32(0, len + 1, true)
    out.set(b, 4)
    out[len + 4 + 1] = 0x00
    return toHexString(out)
}

export const bufferFromHexArray = array => {
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

const blns = JSON.parse(await readFile(PATH + 'blns.json', { encoding: 'utf8' }))

for (let i = 0; i < blns.length; i++) {
    const b = blns[i];
    for (let j = 0; j < i; j++) {
        const b2 = blns[j];
        if (b === b2) console.log(`dupe[i=${i}, j=${j}]: ${stringToUTF8HexBytes(b).slice(8)}`)
    }
    for (let j = i + 1; j < blns.length; j++) {
        const b2 = blns[j];
        if (b === b2) console.log(`dupe[i=${i}, j=${j}]: ${stringToUTF8HexBytes(b).slice(8)}`)
    }
}

// // console.log(duplicates)
// // console.log(duplicates.map(s => stringToUTF8HexBytes(s).slice(8)))
// process.exit(1)

const b = bufferFromHexArray(blns.map(s => {
    const stringWSize = stringToUTF8HexBytes(s)
    return `02${stringWSize.slice(8)}${stringWSize}`
}))

const r = BSONDocument.from(b)

console.log(r.toRecord())
