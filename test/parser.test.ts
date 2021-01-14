import test from 'tape'
import { parse, parseToMap } from '../src/index'
import { accessRaw } from '../src/parser'

test('parse `{a: 2.3}`', function (t) {
	const bsonDocument = parseToMap(
		new Uint8Array([0x10, 0x00, 0x00, 0x00, 0x01, 0x61, 0x00, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x02, 0x40, 0x00])
	)
	t.equal(bsonDocument.documentByteLength, 0x10, `has documentByteLength of ${0x10}`)
	t.equal(bsonDocument.size, 1, 'has 1 key value pair')
	t.equal(bsonDocument.get('a')?.value, 2.3, 'has key `a` equaling 2.3 ')
	t.end()
})

test('parse `{a: 2.3}`', function (t) {
	const bsonDocument = parse(
		new Uint8Array([0x10, 0x00, 0x00, 0x00, 0x01, 0x61, 0x00, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x02, 0x40, 0x00])
	)
	t.equal(bsonDocument.__proto__, undefined, 'has undefined prototype')
	t.equal(bsonDocument.prototype, undefined, 'has undefined prototype')
	t.equal(bsonDocument.a, 2.3, 'has key `a` equaling 2.3 ')
	t.equal(bsonDocument[accessRaw].documentByteLength, 0x10, `has documentByteLength of ${0x10}`)
	t.equal(Object.keys(bsonDocument).length, 1, 'has only one key')
	t.end()
})

test('parse `{}`', function (t) {
	const bsonDocument = parseToMap(new Uint8Array([0x05, 0x00, 0x00, 0x00, 0x00]))
	t.equal(bsonDocument.documentByteLength, 5, `has documentByteLength of ${5}`)
	t.equal(bsonDocument.size, 0, 'has 0 key value pair')
	t.end()
})
