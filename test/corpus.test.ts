import test from 'tape'
import { bytesify, parse } from '../src'
import { TYPE } from '../src/constants'
import { bytesFromHexString } from './test_utils'

import doubleCorpus from './corpus/double.json'

test(doubleCorpus.description, (t) => {
	t.equal(Number.parseInt(doubleCorpus.bson_type.slice(2), 16), TYPE.DOUBLE, 'TYPE.Double and bson_type match')
	for (const validTest of doubleCorpus.valid) {
		test(validTest.description, (t) => {
			const expectedObject = JSON.parse(validTest.relaxed_extjson)
			const expectedBytes = bytesFromHexString(validTest.canonical_bson)

			t.deepEqual(expectedObject, parse(expectedBytes), `${validTest.relaxed_extjson} was parsed correctly from bytes`)
			t.deepEqual(expectedBytes, bytesify(expectedObject), 'object correctly turned into bytes')
		})
	}
	t.end()
})
