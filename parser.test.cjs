const BSON = require('bson');

const test = BSON.serialize({
    a: new BSON.Double(2.3),
    b: 'hello',
    c: null,
    d: undefined,
}, {ignoreUndefined: false})

import('./parser.js').then(({parse}) => {
    const mapRes = parse(test)
    console.dir(mapRes)
    console.log([...mapRes.keys()])
}).catch(console.error)
