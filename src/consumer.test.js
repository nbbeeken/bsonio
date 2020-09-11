const BSON = require('bson');

/** @type {Buffer} */
const test = new BSON.serialize({
    double: new BSON.Double(2.3),
    string: 'hello',
    null: null,
    undefined: undefined,
    document: {a: new BSON.Double(2.3)},
    array: [1.2, 1, 34, 5, null, 'hello'],
    int32: new BSON.Int32(32),
    int64: new BSON.Long(64),
    objectid: new BSON.ObjectId('abcdef1234567891abcdef12'),
}, {ignoreUndefined: false})

const array = new Uint8Array(test.length)
array.set(test)

import('./consumer.mjs').then(({consume}) => {
    const {bsonDocument} = consume(array)
    console.dir(bsonDocument)
    // console.log([...bsonDocument.keys()])
}).catch(console.error)
