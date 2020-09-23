import test from 'tape'
import { bytesify } from '../src/bytesify'
import { parse } from '../src/parser'
import { BSONDouble } from '../src/bson_types'

test('BSONDouble', function (t) {
	const testObject = { d: BSONDouble(2.3) }
	t.deepEqual(bytesify(testObject), bytesify({ d: 2.3 }))
	t.end()
})
