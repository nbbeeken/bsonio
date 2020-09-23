import test from 'tape'
import { bytesify } from '../src/index'

const utfDecoder = new TextDecoder('utf8', { fatal: true })

test('bytesify `{}`', function (t) {
	const emptyDoc = bytesify({})
	t.equal(emptyDoc.byteLength, 5, 'has byteLength of 5')
	const view = new DataView(emptyDoc.buffer)
	t.equal(view.getInt32(0, true), 5, 'has 5 stored LE in the first 4 bytes')
	t.end()
})

test('bytesify `{a: 2.3}`', function (t) {
	const doc = bytesify({ a: 2.3 })
	t.equal(doc.byteLength, 16, 'has byteLength of 16')
	const view = new DataView(doc.buffer)
	t.equal(view.getInt32(0, true), 16, 'has 16 stored LE in the first 4 bytes')
	t.equal(view.getFloat64(7, true), 2.3, 'has 2.3 stored LE at index 7')
	t.equal(view.getUint8(5), 'a'.charCodeAt(0), 'has `a` at index 5')
	t.end()
})

test('bytesify `{s: "hello"}`', function (t) {
	const doc = bytesify({ s: 'hello' })
	t.equal(doc.byteLength, 18, 'has byteLength of 18')
	const view = new DataView(doc.buffer)
	t.equal(view.getInt32(0, true), 18, 'has 18 stored LE in the first 4 bytes')
	t.equal(view.getInt32(7, true), 'hello'.length + 1, 'has "hello".length + 1 stored LE at index 8')
	t.equal('hello', utfDecoder.decode(doc.slice(11, 16)), 'has string "hello" stored at index [11, 16)')
	t.end()
})
