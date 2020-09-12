import { parse } from "../src/parser.js"
import { expect } from "./utils.js"

export async function main() {
    testEmptyDoc()
    testSingleDoubleProp()
}

function testEmptyDoc() {
    const emptyDoc = parse(new Uint8Array([5, 0, 0, 0, 0]))
    expect([...emptyDoc.bsonDocument.keys()].length === 0)
}

function testSingleDoubleProp() {
    const aMapsToDouble = parse(new Uint8Array([0x10, 0x00, 0x00, 0x00, 0x01, 0x61, 0x00, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x02, 0x40, 0x00]))
    expect([...aMapsToDouble.bsonDocument.keys()].length === 1)
    expect(aMapsToDouble.bsonDocument.get('a') === 2.3)
}
