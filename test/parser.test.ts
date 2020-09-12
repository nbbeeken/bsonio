import { parse } from "../src/parser.js"
import { expect, log, logObject } from "./utils.js"

export async function main() {
    testEmptyDoc()
    testSingleDoubleProp()
}

function testEmptyDoc() {
    log('empty doc test')

    const emptyDoc = parse(new Uint8Array([5, 0, 0, 0, 0]))
    expect(Object.keys(emptyDoc).length === 0)
    expect(!('__proto__' in emptyDoc))
    logObject('Empty Doc', emptyDoc)
}

function testSingleDoubleProp() {
    log('single prop `a` double doc test')

    const aMapsToDouble = parse(new Uint8Array([0x10, 0x00, 0x00, 0x00, 0x01, 0x61, 0x00, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x02, 0x40, 0x00]))
    expect(Object.keys(aMapsToDouble).length === 1)
    expect(aMapsToDouble.a === 2.3)
    logObject('Prop `a` is double Doc', aMapsToDouble)
}
