import { describe, it } from 'mocha';
import { expect } from 'chai'
import { consume } from '../src/consumer'

const test = new Uint8Array(0);
// /** @type {Buffer} */
// const test = BSON.serialize({
//     double: new BSON.Double(2.3),
//     string: 'hello',
//     null: null,
//     undefined: undefined,
//     document: {a: new BSON.Double(2.3)},
//     array: [1.2, 1, 34, 5, null, 'hello'],
//     int32: new BSON.Int32(32),
//     int64: new BSON.Long(64, 0),
//     objectid: new BSON.ObjectId('abcdef1234567891abcdef12'),
// }, {ignoreUndefined: false})

const array = new Uint8Array(test.length)
array.set(test)

describe('Consumer', async function () {
    it('will match the reference implementation', async function () {
        const { bsonDocument } = consume(array)
        expect(Object.fromEntries(bsonDocument.entries())).to.have.property('double').and.equals(2.3)
    })
})
