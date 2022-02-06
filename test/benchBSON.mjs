//@ts-check

import { performance } from 'perf_hooks'
import { readFile, writeFile, readdir, access, appendFile, unlink } from 'fs/promises'
import * as path from 'path'
import { EJSON } from 'bson';
import * as MongoDB_BSON from 'bson';
import * as Neal_BSON from '../lib/mod.js';
import { cpus, totalmem } from 'os';

const log = async (msg) => {
    console.log(msg)
    await appendFile('./perf.md', msg + '\n', { encoding: 'utf8' })
}

try {
    await unlink('./perf.md')
} catch { }

const INPUTS_PATH = './test/bench-data/'
const ITERATIONS = 10_000

const canAccess = async (f) => {
    try {
        await access(f)
        return true
    } catch (error) {
        return false
    }
}

async function BSONFiles() {
    const inputFiles = (await readdir(INPUTS_PATH))
        .filter(fileName => fileName.endsWith('.json'))
        .map(fileName => path.join(INPUTS_PATH, fileName))
        .sort()

    const bsonFiles = []
    for (const jsonFile of inputFiles) {
        const bsonFileName = jsonFile.replace('.json', '.bson')
        let bsonData
        if (await canAccess(bsonFileName)) {
            bsonData = await readFile(bsonFileName, { encoding: null })
        } else {
            const content = await readFile(jsonFile, { encoding: 'utf8' })
            /** @type {any} */
            const ejson = EJSON.parse(content, { relaxed: false })
            bsonData = MongoDB_BSON.serialize(ejson, { ignoreUndefined: false })
            await writeFile(bsonFileName, bsonData, { encoding: null })
        }
        bsonFiles.push({ name: path.basename(bsonFileName).replace('.bson', ''), bsonFileName, bsonData, parsed: Neal_BSON.BSONDocument.from(bsonData) })
    }
    return bsonFiles
}

const bsonTests = await BSONFiles()

const hw = cpus()
const ram = totalmem() / (1024 ** 3)
const platform = { name: hw[0].model, cores: hw.length, ram: `${ram}GB` }

function fixedWidthNum(strings, ...values) {
    const stringParts = [strings[0]];
    for (const [idx, value] of values.entries()) {
        if (typeof value === 'number') {
            const numStr = Number.isInteger(value) ? String(value) : value.toFixed(4)
            stringParts.push('`' + numStr + '`');
        } else {
            stringParts.push(String(value));
        }
        stringParts.push(strings[idx + 1]);
    }

    return stringParts.join('');
}

class Suite {
    constructor(name, options) {
        this.name = name
        this.tests = new Map();
    }
    add(testName, testFn) {
        this.tests.set(testName, testFn)
        return this
    }

    async run() {
        const results = new Map()
        await log(`\n### Results - ${this.name}\n`)
        await log('| name | avg | stddev | mode | median |')
        await log('|-|-|-|-|-|')
        for (const [name, test] of this.tests.entries()) {
            const measurements = new Array(ITERATIONS)

            for (let i = 0; i < ITERATIONS; i++) {
                const start = performance.now()
                test()
                const end = performance.now()
                measurements[i] = end - start
            }

            const res = {
                // measurements,
                mean: Suite.mean(measurements),
                stddev: Suite.stddev(measurements),
                mode: Suite.mode(measurements),
                median: Suite.median(measurements)
            }
            results.set(name, res)
            await log(fixedWidthNum`| ${name} | ${res.mean}ms | ${res.stddev} | ${res.mode}ms | ${res.median}ms |`)
        }
        await log(`\nFastest: ${Array.from(results.entries()).sort(([, { mean: meanA }], [, { mean: meanB }]) => meanA - meanB)[0][0]}`)
    }

    static mean(numbers) {
        return numbers.reduce((a, b) => a + b, 0) / numbers.length
    }
    static median(numbers) {
        const sorted = numbers.slice().sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }

        return sorted[middle];
    }
    static mode(arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length
            - arr.filter(v => v === b).length
        ).pop();
    }
    static stddev(arr) {
        // Creating the mean with Array.reduce
        let mean = arr.reduce((acc, curr) => {
            return acc + curr
        }, 0) / arr.length;

        // Assigning (value - mean) ^ 2 to every array item
        arr = arr.map((k) => {
            return (k - mean) ** 2
        })

        // Calculating the sum of updated array
        let sum = arr.reduce((acc, curr) => acc + curr, 0);

        // Calculating the variance
        let variance = sum / arr.length

        // Returning the Standered deviation
        return Math.sqrt(sum / arr.length)
    }
}

const suites = []

for (const { name, bsonData, parsed } of bsonTests) {
    const suite = new Suite(name)
    suite
        .add('🍃 BSON.deserialize', function () {
            MongoDB_BSON.deserialize(bsonData)
        })
        .add('👨‍💻 entriesFromBSON', function () {
            Array.from(Neal_BSON.entriesFromBSON(bsonData))
        })
        .add('👨‍💻 BSONDocument.from', function () {
            Neal_BSON.BSONDocument.from(bsonData)
        })
        .add('👨‍💻 BSONDocument.toRecord', function () {
            parsed.toRecord()
        });
    suites.push(suite)
}

await log(`# BSON Bench

## Hardware
- cpu: ${platform.name}
- cores: ${platform.cores}
- os: ${process.platform}
- ram: ${platform.ram}
- iterations: ${ITERATIONS}

## Inputs

| name | bytes | top-level keys |
|-|-|-|
${bsonTests.map(({ name, bsonData, parsed }) => `| ${name}  | ${bsonData.byteLength} | ${Array.from(parsed.keys()).length} |`).join('\n')}
`)

for (const s of suites) {
    await s.run()
}
