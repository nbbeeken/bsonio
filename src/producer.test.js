const BSON = require('bson');

const test = {
    a: 2.3,
    b: 1.3,
}

import('./producer.mjs').then(({convertPOJOtoMap, produce}) => {
    const map = convertPOJOtoMap(test);
    console.log(map)
    const bytes = produce(map)
    console.log(bytes.toString().split(',').map(v => (+v).toString(16).toUpperCase()).join(','))
    console.log(BSON.deserialize(bytes))
}).catch(console.error)
