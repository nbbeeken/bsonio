import { BSONDocument } from "../src/mod.mjs";
import { readFile } from 'fs/promises'

const PATH = './test/bench-data/extended_bson/'

const flat = await readFile(PATH + 'flat_bson.bson', { encoding: null })

BSONDocument.from(flat)
