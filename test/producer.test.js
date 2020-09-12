const BSON = require('bson');
const { expect } = require('chai');
const { toHexString } = require('./helpers.js')
const { convertPOJOtoMap, produce } = require('../src/producer.js')
const { consume } = require('../src/consumer.js')

describe('Producer', function () {


    it('will match the reference implementation', async function () {


        const test = {
            a: 2.3,
            b: 1.3,
            c: 'hello',
            d: 23n,
        }

        const map = convertPOJOtoMap(test);
        // console.log(map)
        const bytes = produce(map)
        console.log(toHexString(bytes))
        // expect(toHexString(bytes)).to.equal(toHexString(BSON.serialize(test)))
        console.log(Object.fromEntries(consume(bytes).bsonDocument.entries()))
    })
})
