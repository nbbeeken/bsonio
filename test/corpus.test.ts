import test from 'tape'
import { TYPE } from '../src/constants'

import doubleCorpus from './corpus/double.json'

test(doubleCorpus.description, function (t) {
	t.equal(Number.parseInt(doubleCorpus.bson_type.slice(2), 16), TYPE.DOUBLE, 'TYPE.Double and bson_type match')
	t.end()
})
