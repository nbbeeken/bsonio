import { performance } from 'perf_hooks'
import { readFile, writeFile } from 'fs/promises'
import { EJSON } from 'bson';
import * as MongoDB_BSON from 'bson';
import * as Neal_BSON from '../src/mod.mjs';

const PATH = './test/bench-data/extended_bson/'
async function makeBSONFiles() {
    await writeFile(PATH + 'deep_bson.bson',
        MongoDB_BSON.serialize(
            EJSON.parse(
                await readFile(PATH + 'deep_bson.json', { encoding: 'utf8' }),
                { relaxed: false }
            )
        )
    )
    await writeFile(PATH + 'flat_bson.bson',
        MongoDB_BSON.serialize(
            EJSON.parse(
                await readFile(PATH + 'flat_bson.json', { encoding: 'utf8' }),
                { relaxed: false }
            )
        )
    )
    await writeFile(PATH + 'full_bson.bson',
        MongoDB_BSON.serialize(
            EJSON.parse(
                await readFile(PATH + 'full_bson.json', { encoding: 'utf8' }),
                { relaxed: false }
            )
        )
    )
}
// await makeBSONFiles()
// process.exit(1)

const deep = await readFile(PATH + 'deep_bson.bson', { encoding: null })
const flat = await readFile(PATH + 'flat_bson.bson', { encoding: null })
const full = await readFile(PATH + 'full_bson.bson', { encoding: null })

import { cpus, totalmem } from 'os';
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
        this.options = { iterations: 10_000, ...options }
        this.tests = new Map();
    }
    add(testName, testFn) {
        this.tests.set(testName, testFn)
        return this
    }

    run() {
        const results = new Map()
        for (const [name, test] of this.tests.entries()) {
            const measurements = new Array(this.options.iterations)

            for (let i = 0; i < this.options.iterations; i++) {
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
                median: Suite.median(measurements),
                iterations: this.options.iterations
            }
            results.set(name, res)
            console.log(fixedWidthNum`| ${name} | ${res.iterations} | ${res.mean}ms | ${res.stddev} | ${res.mode}ms | ${res.median}ms |`)
        }

        this.options.onComplete(results)
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

const options = {
    onError(event) {
        console.log('err:', event.target.error);
    },
    onComplete(results) {
        // console.log('Fastest is ', results)
    }
}

const deepSuite = new Suite('deep', options);
deepSuite
    .add('🍃 BSON.deserialize', function () {
        MongoDB_BSON.deserialize(deep)
    })
    .add('👨‍💻 BSONDocument.from', function () {
        Neal_BSON.BSONDocument.from(deep)
    })
    .add('👨‍💻 BSONDocument.from.toRecord', function () {
        Neal_BSON.BSONDocument.from(deep).toRecord()
    });

const fullSuite = new Suite('full', options);
fullSuite
    .add('🍃 BSON.deserialize', function () {
        MongoDB_BSON.deserialize(full)
    })
    .add('👨‍💻 BSONDocument.from', function () {
        Neal_BSON.BSONDocument.from(full)
    })
    .add('👨‍💻 BSONDocument.from.toRecord', function () {
        Neal_BSON.BSONDocument.from(full).toRecord()
    });

const flatSuite = new Suite('flat', options);
flatSuite
    .add('🍃 BSON.deserialize', function () {
        MongoDB_BSON.deserialize(flat)
    })
    .add('👨‍💻 BSONDocument.from', function () {
        Neal_BSON.BSONDocument.from(flat)
    })
    .add('👨‍💻 BSONDocument.from.toRecord', function () {
        Neal_BSON.BSONDocument.from(flat).toRecord()
    });

console.log(`# BSON Bench

## Hardware
- cpu: ${platform.name}
- cores: ${platform.cores}
- os: ${process.platform}
- ram: ${platform.ram}

## Results
| name | iter | avg | stddev | mode | median |
|-|-|-|-|-|-|`)
deepSuite.run();
flatSuite.run();
fullSuite.run();
