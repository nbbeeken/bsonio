import { BSONDocument } from "../src/mod.mjs";
import { readFile } from 'fs/promises'

const PATH = './test/bench-data/extended_bson/'

const full = await readFile(PATH + 'full_bson.bson', { encoding: null })

BSONDocument.from(full)
