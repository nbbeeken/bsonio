import { readdir, readFile } from 'fs/promises'
import * as path from 'path'
import { BSONDocument } from '../src/mod.mjs'

let testFiles = await readdir('./test/corpus')
testFiles = testFiles.filter(f => !['regex.json', 'dbref.json', 'multi-type-deprecated.json', 'multi-type.json'].includes(f))

const corpus = await Promise.all(testFiles.map(async fn => JSON.parse(await readFile(path.join('./test/corpus', fn), { encoding: 'utf8' }))))

const bytesFromHex = (hex) => {
	const bytes = []
	for (let i = 0; i < hex.length; i += 2) {
		const byte = hex.slice(i, i + 2)
		bytes.push(Number.parseInt(byte, 16))
	}
	return new Uint8Array(bytes)
}

for (const test of corpus) {
	for (const valid of test.valid ?? []) {
		const doc = BSONDocument.from(bytesFromHex(valid.canonical_bson))
		if (test.test_key && !doc.has(test.test_key)) throw new Error(`doc must have ${test.test_key}`)
		console.log(`pass ${valid.description}`)
	}

	for (const decodeError of test.decodeErrors ?? []) {

		let thrownError = null
		try {
			BSONDocument.from(bytesFromHex(decodeError.bson))
		} catch (error) {
			thrownError = error
		}
		// if (thrownError == null) throw new Error(`must throw on parsing`)
		console.log(`${thrownError ? 'pass' : 'fail'} ${decodeError.description}`)

	}
}
