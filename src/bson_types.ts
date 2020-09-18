import { ObjectId } from "./objectid"

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
        value: 'BSONUndefined',
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


export function DBPointer({ namespace, oid }: { namespace: string, oid: ObjectId }) {
    const box = { value: { namespace, oid } }
    Object.defineProperty(box, '_bsontype', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 'DBPointer',
    })
    return box
}


export function Code({ code }: { code: string }) {
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
        value: 'BSONSymbol',
    })
    return box
}


export function CodeWithScope({ code, scope }: { code: string | Function, scope: Record<string, any> }) {
    const box = { value: { code: code.toString(), scope } }
    Object.defineProperty(box, '_bsontype', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 'CodeWithScope',
    })
    return box
}


export function Int32(value: number) {
    const box = { value }
    Object.defineProperty(box, '_bsontype', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 'Int32',
    })
    return box
}


export function Timestamp(value: bigint) {
    const box = { value }
    Object.defineProperty(box, '_bsontype', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 'Timestamp',
    })
    return box
}


export function Int64(value: bigint) {
    const box = { value }
    Object.defineProperty(box, '_bsontype', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 'Int64',
    })
    return box
}

export function MinKey() {
    const box = {}
    Object.defineProperty(box, '_bsontype', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 'MinKey',
    })
    return box
}


export function MaxKey() {
    const box = {}
    Object.defineProperty(box, '_bsontype', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 'MaxKey',
    })
    return box
}
