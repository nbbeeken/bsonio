import * as BSON from 'bson'
import { expect } from 'chai';
import { toHexString } from './helpers'
import { convertPOJOtoMap, produce } from '../src/producer'
import { consume } from '../src/consumer'

describe('Producer', function () {


    it('will match the reference implementation', async function () {


        const test = {
            a: 2.3,
            b: 1.3,
            c: 'hello',
            d: 23n,
            e: {
                a: 1.2
            }
        }

        const map = convertPOJOtoMap(test);
        console.log(map)
        const bytes = produce(map)
        console.log(toHexString(bytes))
        expect(toHexString(bytes)).to.equal(toHexString(BSON.serialize(test)))
        console.log(Object.fromEntries(consume(bytes).bsonDocument.entries()))
    })
})
