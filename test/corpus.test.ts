import test from 'tape'
import { bytesFromMap, parseToMap } from '../src'
import { TYPE } from '../src/constants'
import { bytesFromHexString } from './test_utils'

import doubleCorpus from './corpus/double.json'
import int32Corpus from './corpus/int32.json'
import int64Corpus from './corpus/int64.json'

const corpusTests = [
	doubleCorpus,
	int32Corpus,
	int64Corpus,
]

test(doubleCorpus.description, (t) => {
	t.equal(Number.parseInt(doubleCorpus.bson_type.slice(2), 16), TYPE.DOUBLE, 'TYPE.Double and bson_type match')
	for (const corpusTest of corpusTests) {
		for (const validTest of corpusTest.valid) {
			test(`${corpusTest.description} - '${validTest.description}'`, (t) => {
				const canonicalBSON = bytesFromHexString(validTest.canonical_bson)
				const bsonMap = parseToMap(canonicalBSON)
				const roundTripped = bytesFromMap(bsonMap)
				t.deepEqual(canonicalBSON, roundTripped, `${validTest.relaxed_extjson} was parsed correctly from bytes`)
				t.end()
			})
		}
	}
	t.end()
})
