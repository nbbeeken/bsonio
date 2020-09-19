export { parse, parse_to_map, BSONDocument } from './parser'
export { bytesify, BSONValueDescriptor } from './bytesify'

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
} from './bson_types'

export { ObjectId } from './objectid'

/**
 * A library for parsing BSON.
 *
 * @remarks
 * The {@link parse} and {@link bytesify} functions are intended to be
 * mirrored apis of JSON.parse and JSON.stringify
 *
 * @packageDocumentation
 */
