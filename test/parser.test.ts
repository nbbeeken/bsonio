import test from 'tape'
import { parse, parse_to_map } from '../src/index'


// function testSingleDoubleProp() {
//     log('single prop `a` double doc test')

//     const aMapsToDouble = parse(new Uint8Array([0x10, 0x00, 0x00, 0x00, 0x01, 0x61, 0x00, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x02, 0x40, 0x00]))
//     expect(Object.keys(aMapsToDouble).length === 1)
//     expect(aMapsToDouble.bsonDocument.size === 1)
//     expect(aMapsToDouble.bsonDocument.get('a') === 2.3)
//     logObject('Prop `a` is double Doc', aMapsToDouble)
// }

// describe('Parser reads binary BSON documents', function () {
//     it('should read an empty document', function () {
//         const emptyDoc = parse(new Uint8Array([5, 0, 0, 0, 0]))
//         expect(emptyDoc.documentSize).to.equal(0)
//         logObject('Empty Doc', emptyDoc)
//     })
// })


test('parser', function (t) {
    //@ts-ignore
    const bsonDocument = parse_to_map(new Uint8Array([0x10, 0x00, 0x00, 0x00, 0x01, 0x61, 0x00, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x02, 0x40, 0x00]))
    t.equal(bsonDocument.documentByteLength, 0x10)
    t.equal(bsonDocument.size, 1, 'Should have 1 property')
    t.equal(bsonDocument.get('a')?.value, 2.3, 'Should have property `a` === 2.3 ')
    t.end()
})
