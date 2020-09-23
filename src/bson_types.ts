import { TYPE } from './constants'
import { ObjectId } from './objectid'

export const BSON_TYPE_MAP = new Map([
	['Double', { fn: BSONDouble, type: TYPE.DOUBLE }],
	['Undefined', { fn: BSONUndefined, type: TYPE.UNDEFINED }],
])

export function BSONDouble(value: number) {
	const box = { value }
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'Double',
	})
	return box
}

export function BSONUndefined() {
	const box = {}
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'Undefined',
	})
	return box
}

export function BSONNull() {
	const box = {}
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'Null',
	})
	return box
}

export function BSONDbPointer({ namespace, oid }: { namespace: string; oid: ObjectId }) {
	const box = { value: { namespace, oid } }
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'DbPointer',
	})
	return box
}

export function BSONCode({ code }: { code: string }) {
	const box = { value: { code } }
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'Code',
	})
	return box
}

export function BSONSymbol(value: string | symbol) {
	const box = { value: typeof value === 'string' ? value : value.description }
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'Symbol',
	})
	return box
}

export function BSONCodeWithScope({ code, scope }: { code: string | Function; scope: Record<string, any> }) {
	const box = { value: { code: code.toString(), scope } }
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'CodeWithScope',
	})
	return box
}

export function BSONInt32(value: number) {
	const box = { value }
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'Int32',
	})
	return box
}

export function BSONTimestamp(value: bigint) {
	const box = { value }
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'Timestamp',
	})
	return box
}

export function BSONInt64(value: bigint) {
	const box = { value }
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'Int64',
	})
	return box
}

export function BSONMinKey() {
	const box = {}
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'MinKey',
	})
	return box
}

export function BSONMaxKey() {
	const box = {}
	Object.defineProperty(box, '_bsontype', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: 'MaxKey',
	})
	return box
}
