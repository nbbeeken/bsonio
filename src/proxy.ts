import { accessRaw } from './parser'

export function makeProxyFromDocument(document: Record<string, any>) {
    const p = new Proxy(document, new BSONProxyHandler(document as any))
    return p
}

class BSONProxyHandler implements ProxyHandler<Record<string, any>> {
    document
    constructor(document: Record<string | typeof accessRaw, any>) {
        this.document = document
    }
    getPrototypeOf(): null {
        return null
    }
    setPrototypeOf(): boolean {
        return false
    }
    isExtensible(): boolean {
        return true
    }
    preventExtensions(): boolean {
        return false
    }
    getOwnPropertyDescriptor(target: Record<string, any>, p: PropertyKey): PropertyDescriptor | undefined {
        return Reflect.getOwnPropertyDescriptor(target, p)
    }
    has(target: Record<string, any>, p: PropertyKey): boolean {
        return Reflect.has(target, p)
    }
    get(target: any, p: string): any {
        return this.document[p]
    }
    set(target: any, p: string, value: any, receiver: any): boolean {
        this.document[p] = value
        return true
    }
    deleteProperty(target: Record<string, any>, p: PropertyKey): boolean {
        return Reflect.deleteProperty(target, p)
    }
    defineProperty(target: Record<string, any>, p: PropertyKey, attributes: PropertyDescriptor): boolean {
        return Reflect.defineProperty(target, p, attributes)
    }
    ownKeys(target: Record<string, any>): PropertyKey[] {
        return Object.keys(this.document)
    }
    apply(): never {
        throw TypeError('BSON Document not callable')
    }
    construct(): never {
        throw TypeError('BSON Document not a constructor')
    }
}
