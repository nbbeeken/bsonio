import test from 'tape'
import { bytesify } from '../src/index'

// function testSingleDoubleProp() {
//     const bytesShouldBe = new Uint8Array([0x10, 0x00, 0x00, 0x00, 0x01, 0x61, 0x00, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x02, 0x40, 0x00])
//     const aMapsToDouble = bytesify({ a: 2.3 })
//     const view = new DataView(aMapsToDouble.buffer)
//     expect(view.getFloat64(7, true) === 2.3)
//     expect(aMapsToDouble.every((v, i) => v === bytesShouldBe[i]))
// }

test('bytesify', function (t) {
    const emptyDoc = bytesify({})
    t.equal(emptyDoc.byteLength, 5, 'has byteLength of 5')
    const view = (new DataView(emptyDoc.buffer))
    t.equal(view.getInt32(0, true), 5, 'has 5 stored LE in the first 4 bytes')
    t.end()
})
