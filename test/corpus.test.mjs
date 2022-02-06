//@ts-check

import { expect } from 'chai'
import { readdir, readFile } from 'fs/promises'
import * as path from 'path'
import { BSONDocument } from '../lib/mod.js'

/**
 * @param {string} hex
 * @returns {Uint8Array}
 */
const bytesFromHex = (hex) => {
    const bytes = []
    for (let i = 0; i < hex.length; i += 2) {
        const byte = hex.slice(i, i + 2)
        bytes.push(Number.parseInt(byte, 16))
    }
    return new Uint8Array(bytes)
}

/**
 * @param {{length: number}} s
 * @returns {boolean}
 */
const isEvenLength = s => s.length % 2 === 0

/**
 * @param {any} test
 * @returns {test is import('./corpus.js').BSONCorpusSuite}
 */
const validateTest = (test) => {
    expect(test).to.have.property('description').that.is.a('string')
    expect(test).to.have.property('bson_type').that.is.a('string').with.lengthOf(4)
    if ('test_key' in test) expect(test.test_key).to.be.a('string')
    if ('valid' in test) {
        expect(test.valid).to.be.an('array').with.lengthOf.at.least(1)
        for (const validCase of test.valid) {
            expect(validCase).to.have.property('description').that.is.a('string')
            expect(validCase).to.have.property('canonical_bson').that.is.a('string').that.satisfies(isEvenLength)
            validCase.bytes_canonical_bson = bytesFromHex(validCase.canonical_bson)
            expect(validCase).to.have.property('canonical_extjson').that.is.a('string')
        }
    }
    if ('decodeErrors' in test) {
        expect(test.decodeErrors).to.be.an('array')
        for (const decodeCase of test.decodeErrors) {
            expect(decodeCase).to.have.property('description').that.is.a('string')
            expect(decodeCase).to.have.property('bson').that.is.a('string').that.satisfies(isEvenLength)
            decodeCase.bytes_bson = bytesFromHex(decodeCase.bson)
        }
    }
    if ('deprecated' in test) expect(test.deprecated).to.be.true
    return true
}

let testFiles = await readdir('./test/corpus')

const corpus = await Promise.all(
    testFiles.map(async fileName => {
        const test = JSON.parse(await readFile(path.join('./test/corpus', fileName), { encoding: 'utf8' }))
        test.fileName = fileName
        if (validateTest(test)) return test
        throw new Error('unreachable')
    })
)

const parseJSON = s => {
    try {
        return JSON.parse(s)
    } catch (error) {
        error.message += `//// ${s}`
        throw error
    }
}

describe('BSON Corpus Tests', () => {
    for (const suite of corpus) {
        // if (suite.description === 'Decimal128') continue
        // if (suite.description === 'Binary type') continue
        describe(`${suite.fileName} ${suite.description}`, () => {
            describe('valid', () => {
                for (const test of suite.valid ?? []) {
                    it(test.description, () => {
                        const doc = BSONDocument.from(test.bytes_canonical_bson)
                        const keys = Array.from(doc.keys())
                        const values = Array.from(doc.entiresAsBSONValues()).map(([, v]) => parseJSON(v.toEJSON()))
                        const expected = JSON.parse(test.canonical_extjson)
                        expect(keys).to.deep.equal(Object.keys(expected))
                        expect(values).to.deep.equal(Object.values(expected))
                    })
                }
            })


            describe('decodeErrors', () => {
                for (const test of suite.decodeErrors ?? []) {
                    it.skip(test.description, () => {
                        let thrownError = null
                        let doc = null
                        try {
                            doc = BSONDocument.from(test.bytes_bson)
                            console.log(doc)
                        } catch (error) {
                            thrownError = error
                        }
                        expect(doc).to.not.exist;
                        expect(thrownError).to.exist;
                    })
                }
            })

        })
    }
})
