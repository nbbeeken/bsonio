export { parse, parseToMap, BSONDocument, accessRaw } from './parser.js'
export { bytesify, bytesFromMap, BSONValue } from './bytesify.js'

export {
	BSONCode,
	BSONCodeWithScope,
	BSONDbPointer,
	BSONDouble,
	BSONInt32,
	BSONInt64,
	BSONMaxKey,
	BSONMinKey,
	BSONNull,
	BSONSymbol,
	BSONTimestamp,
	BSONUndefined,
} from './bson_types.js'

export { ObjectId } from './objectid.js'

/**
 * A library for parsing BSON.
 *
 * @remarks
 * The {@link parse} and {@link bytesify} functions are intended to be
 * mirrored apis of JSON.parse and JSON.stringify
 *
 * @packageDocumentation
 */
