<a name="readmemd"></a>

**bsonio**

README / [Globals](#globalsmd)

# bsonio

- [documentation](./docs.md)

# Classes

<a name="classesbsondocumentmd"></a>

**bsonio**

[README](#readmemd) / [Globals](#globalsmd) / BSONDocument

## Class: BSONDocument

### Hierarchy

- [Map](#map)\<string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)>

  ↳ **BSONDocument**

### Index

#### Properties

- [[Symbol.toStringTag]](bsondocument.md#[symbol.tostringtag])
- [documentByteLength](#documentbytelength)
- [size](#size)
- [Map](#map)

#### Methods

- [[Symbol.iterator]](bsondocument.md#[symbol.iterator])
- [clear](#clear)
- [delete](#delete)
- [entries](#entries)
- [forEach](#foreach)
- [get](#get)
- [has](#has)
- [keys](#keys)
- [set](#set)
- [values](#values)

### Properties

#### [Symbol.toStringTag]

• `Readonly` **[Symbol.toStringTag]**: string

_Inherited from [BSONDocument](#classesbsondocumentmd).[[Symbol.toStringTag]](bsondocument.md#[symbol.tostringtag])_

_Defined in node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:130_

---

#### documentByteLength

• **documentByteLength**: number

_Defined in [src/parser.ts:9](https://github.com/nbbeeken/bsonio/blob/88408dd/src/parser.ts#L9)_

---

#### size

• `Readonly` **size**: number

_Inherited from [BSONDocument](#classesbsondocumentmd).[size](#size)_

_Defined in node_modules/typescript/lib/lib.es2015.collection.d.ts:28_

---

#### Map

▪ `Static` **Map**: MapConstructor

_Defined in node_modules/typescript/lib/lib.es2015.collection.d.ts:36_

### Methods

#### [Symbol.iterator]

▸ **[Symbol.iterator]**(): IterableIterator\<[string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)]>

_Inherited from [BSONDocument](#classesbsondocumentmd).[[Symbol.iterator]](bsondocument.md#[symbol.iterator])_

_Defined in node_modules/typescript/lib/lib.es2015.iterable.d.ts:121_

Returns an iterable of entries in the map.

**Returns:** IterableIterator\<[string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)]>

---

#### clear

▸ **clear**(): void

_Inherited from [BSONDocument](#classesbsondocumentmd).[clear](#clear)_

_Defined in node_modules/typescript/lib/lib.es2015.collection.d.ts:22_

**Returns:** void

---

#### delete

▸ **delete**(`key`: string): boolean

_Inherited from [BSONDocument](#classesbsondocumentmd).[delete](#delete)_

_Defined in node_modules/typescript/lib/lib.es2015.collection.d.ts:23_

##### Parameters:

| Name  | Type   |
| ----- | ------ |
| `key` | string |

**Returns:** boolean

---

#### entries

▸ **entries**(): IterableIterator\<[string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)]>

_Inherited from [BSONDocument](#classesbsondocumentmd).[entries](#entries)_

_Defined in node_modules/typescript/lib/lib.es2015.iterable.d.ts:126_

Returns an iterable of key, value pairs for every entry in the map.

**Returns:** IterableIterator\<[string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)]>

---

#### forEach

▸ **forEach**(`callbackfn`: (value: [BSONValueDescriptor](#interfacesbsonvaluedescriptormd),key: string,map: [Map](#map)\<string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)>) => void, `thisArg?`: any): void

_Inherited from [BSONDocument](#classesbsondocumentmd).[forEach](#foreach)_

_Defined in node_modules/typescript/lib/lib.es2015.collection.d.ts:24_

##### Parameters:

| Name         | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `callbackfn` | (value: [BSONValueDescriptor](#interfacesbsonvaluedescriptormd),key: string,map: [Map](#map)\<string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)>) => void |
| `thisArg?`   | any                                                                                                                                                                     |

**Returns:** void

---

#### get

▸ **get**(`key`: string): [BSONValueDescriptor](#interfacesbsonvaluedescriptormd) \| undefined

_Inherited from [BSONDocument](#classesbsondocumentmd).[get](#get)_

_Defined in node_modules/typescript/lib/lib.es2015.collection.d.ts:25_

##### Parameters:

| Name  | Type   |
| ----- | ------ |
| `key` | string |

**Returns:** [BSONValueDescriptor](#interfacesbsonvaluedescriptormd) \| undefined

---

#### has

▸ **has**(`key`: string): boolean

_Inherited from [BSONDocument](#classesbsondocumentmd).[has](#has)_

_Defined in node_modules/typescript/lib/lib.es2015.collection.d.ts:26_

##### Parameters:

| Name  | Type   |
| ----- | ------ |
| `key` | string |

**Returns:** boolean

---

#### keys

▸ **keys**(): IterableIterator\<string>

_Inherited from [BSONDocument](#classesbsondocumentmd).[keys](#keys)_

_Defined in node_modules/typescript/lib/lib.es2015.iterable.d.ts:131_

Returns an iterable of keys in the map

**Returns:** IterableIterator\<string>

---

#### set

▸ **set**(`key`: string, `value`: [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)): this

_Inherited from [BSONDocument](#classesbsondocumentmd).[set](#set)_

_Defined in node_modules/typescript/lib/lib.es2015.collection.d.ts:27_

##### Parameters:

| Name    | Type                                                    |
| ------- | ------------------------------------------------------- |
| `key`   | string                                                  |
| `value` | [BSONValueDescriptor](#interfacesbsonvaluedescriptormd) |

**Returns:** this

---

#### values

▸ **values**(): IterableIterator\<[BSONValueDescriptor](#interfacesbsonvaluedescriptormd)>

_Inherited from [BSONDocument](#classesbsondocumentmd).[values](#values)_

_Defined in node_modules/typescript/lib/lib.es2015.iterable.d.ts:136_

Returns an iterable of values in the map

**Returns:** IterableIterator\<[BSONValueDescriptor](#interfacesbsonvaluedescriptormd)>

<a name="classesobjectidmd"></a>

**bsonio**

[README](#readmemd) / [Globals](#globalsmd) / ObjectId

## Class: ObjectId

### Hierarchy

- **ObjectId**

### Index

#### Constructors

- [constructor](#constructor)

#### Properties

- [#id](##id)

### Constructors

#### constructor

\+ **new ObjectId**(): [ObjectId](#classesobjectidmd)

_Defined in [src/objectid.ts:2](https://github.com/nbbeeken/bsonio/blob/88408dd/src/objectid.ts#L2)_

**Returns:** [ObjectId](#classesobjectidmd)

### Properties

#### #id

• `Private` **#id**: Uint8Array

_Defined in [src/objectid.ts:2](https://github.com/nbbeeken/bsonio/blob/88408dd/src/objectid.ts#L2)_

# Enums

<a name="enumstypemd"></a>

**bsonio**

[README](#readmemd) / [Globals](#globalsmd) / TYPE

## Enumeration: TYPE

### Index

#### Enumeration members

- [ARRAY](#array)
- [BINARY](#binary)
- [BOOLEAN](#boolean)
- [CODE](#code)
- [CODE_WITH_SCOPE](#code_with_scope)
- [DB_POINTER](#db_pointer)
- [DECIMAL128](#decimal128)
- [DOCUMENT](#document)
- [DOUBLE](#double)
- [INT32](#int32)
- [INT64](#int64)
- [MAX_KEY](#max_key)
- [MIN_KEY](#min_key)
- [NULL](#null)
- [OBJECTID](#objectid)
- [REGEX](#regex)
- [STRING](#string)
- [SYMBOL](#symbol)
- [TIMESTAMP](#timestamp)
- [UNDEFINED](#undefined)
- [UTC_DATE](#utc_date)

### Enumeration members

#### ARRAY

• **ARRAY**: {} = 4

_Defined in [src/constants.ts:5](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L5)_

---

#### BINARY

• **BINARY**: {} = 5

_Defined in [src/constants.ts:6](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L6)_

---

#### BOOLEAN

• **BOOLEAN**: {} = 8

_Defined in [src/constants.ts:9](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L9)_

---

#### CODE

• **CODE**: {} = 13

_Defined in [src/constants.ts:14](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L14)_

---

#### CODE_WITH_SCOPE

• **CODE_WITH_SCOPE**: {} = 15

_Defined in [src/constants.ts:16](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L16)_

---

#### DB_POINTER

• **DB_POINTER**: {} = 12

_Defined in [src/constants.ts:13](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L13)_

---

#### DECIMAL128

• **DECIMAL128**: {} = 19

_Defined in [src/constants.ts:20](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L20)_

---

#### DOCUMENT

• **DOCUMENT**: {} = 3

_Defined in [src/constants.ts:4](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L4)_

---

#### DOUBLE

• **DOUBLE**: {} = 1

_Defined in [src/constants.ts:2](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L2)_

---

#### INT32

• **INT32**: {} = 16

_Defined in [src/constants.ts:17](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L17)_

---

#### INT64

• **INT64**: {} = 18

_Defined in [src/constants.ts:19](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L19)_

---

#### MAX_KEY

• **MAX_KEY**: {} = 127

_Defined in [src/constants.ts:22](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L22)_

---

#### MIN_KEY

• **MIN_KEY**: {} = 255

_Defined in [src/constants.ts:21](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L21)_

---

#### NULL

• **NULL**: {} = 10

_Defined in [src/constants.ts:11](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L11)_

---

#### OBJECTID

• **OBJECTID**: {} = 7

_Defined in [src/constants.ts:8](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L8)_

---

#### REGEX

• **REGEX**: {} = 11

_Defined in [src/constants.ts:12](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L12)_

---

#### STRING

• **STRING**: {} = 2

_Defined in [src/constants.ts:3](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L3)_

---

#### SYMBOL

• **SYMBOL**: {} = 14

_Defined in [src/constants.ts:15](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L15)_

---

#### TIMESTAMP

• **TIMESTAMP**: {} = 17

_Defined in [src/constants.ts:18](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L18)_

---

#### UNDEFINED

• **UNDEFINED**: {} = 6

_Defined in [src/constants.ts:7](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L7)_

---

#### UTC_DATE

• **UTC_DATE**: {} = 9

_Defined in [src/constants.ts:10](https://github.com/nbbeeken/bsonio/blob/88408dd/src/constants.ts#L10)_

<a name="globalsmd"></a>

**bsonio**

[README](#readmemd) / Globals

# Globals

## Index

### Enumerations

- [TYPE](#enumstypemd)

### Classes

- [BSONDocument](#classesbsondocumentmd)
- [ObjectId](#classesobjectidmd)

### Interfaces

- [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)

### Variables

- [INT64_MAX](#int64_max)
- [encoder](#encoder)
- [utfDecoder](#utfdecoder)

### Functions

- [BSONCode](#bsoncode)
- [BSONCodeWithScope](#bsoncodewithscope)
- [BSONDbPointer](#bsondbpointer)
- [BSONDouble](#bsondouble)
- [BSONInt32](#bsonint32)
- [BSONInt64](#bsonint64)
- [BSONMaxKey](#bsonmaxkey)
- [BSONMinKey](#bsonminkey)
- [BSONNull](#bsonnull)
- [BSONSymbol](#bsonsymbol)
- [BSONTimestamp](#bsontimestamp)
- [BSONUndefined](#bsonundefined)
- [bsonDescriptorFrom](#bsondescriptorfrom)
- [bytesify](#bytesify)
- [calculateSize](#calculatesize)
- [convertPOJOtoMap](#convertpojotomap)
- [getCString](#getcstring)
- [getString](#getstring)
- [mapToArray](#maptoarray)
- [parse](#parse)
- [parse_to_map](#parse_to_map)
- [utf8StringLength](#utf8stringlength)
- [writeBSONValue](#writebsonvalue)
- [writeCString](#writecstring)

## Variables

### INT64_MAX

• `Const` **INT64_MAX**: bigint = BigInt('0x7FFFFFFFFFFFFFFF')

_Defined in [src/bytesify.ts:4](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L4)_

---

### encoder

• `Const` **encoder**: TextEncoder = new TextEncoder()

_Defined in [src/bytesify.ts:136](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L136)_

---

### utfDecoder

• `Const` **utfDecoder**: TextDecoder = new TextDecoder('utf8', { fatal: true })

_Defined in [src/parser.ts:136](https://github.com/nbbeeken/bsonio/blob/88408dd/src/parser.ts#L136)_

## Functions

### BSONCode

▸ **BSONCode**(`__namedParameters`: { code: string }): object

_Defined in [src/bson_types.ts:49](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L49)_

#### Parameters:

| Name                | Type             |
| ------------------- | ---------------- |
| `__namedParameters` | { code: string } |

**Returns:** object

| Name    | Type             |
| ------- | ---------------- |
| `value` | { code: string } |

---

### BSONCodeWithScope

▸ **BSONCodeWithScope**(`__namedParameters`: { code: string \| Function ; scope: Record\<string, any> }): object

_Defined in [src/bson_types.ts:73](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L73)_

#### Parameters:

| Name                | Type                                                       |
| ------------------- | ---------------------------------------------------------- |
| `__namedParameters` | { code: string \| Function ; scope: Record\<string, any> } |

**Returns:** object

| Name    | Type                                                            |
| ------- | --------------------------------------------------------------- |
| `value` | { code: string = code.toString(); scope: Record\<string, any> } |

---

### BSONDbPointer

▸ **BSONDbPointer**(`__namedParameters`: { namespace: string ; oid: [ObjectId](#classesobjectidmd) }): object

_Defined in [src/bson_types.ts:37](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L37)_

#### Parameters:

| Name                | Type                                                        |
| ------------------- | ----------------------------------------------------------- |
| `__namedParameters` | { namespace: string ; oid: [ObjectId](#classesobjectidmd) } |

**Returns:** object

| Name    | Type                                                        |
| ------- | ----------------------------------------------------------- |
| `value` | { namespace: string ; oid: [ObjectId](#classesobjectidmd) } |

---

### BSONDouble

▸ **BSONDouble**(`value`: number): object

_Defined in [src/bson_types.ts:3](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L3)_

#### Parameters:

| Name    | Type   |
| ------- | ------ |
| `value` | number |

**Returns:** object

| Name    | Type   |
| ------- | ------ |
| `value` | number |

---

### BSONInt32

▸ **BSONInt32**(`value`: number): object

_Defined in [src/bson_types.ts:85](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L85)_

#### Parameters:

| Name    | Type   |
| ------- | ------ |
| `value` | number |

**Returns:** object

| Name    | Type   |
| ------- | ------ |
| `value` | number |

---

### BSONInt64

▸ **BSONInt64**(`value`: bigint): object

_Defined in [src/bson_types.ts:109](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L109)_

#### Parameters:

| Name    | Type   |
| ------- | ------ |
| `value` | bigint |

**Returns:** object

| Name    | Type   |
| ------- | ------ |
| `value` | bigint |

---

### BSONMaxKey

▸ **BSONMaxKey**(): object

_Defined in [src/bson_types.ts:132](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L132)_

**Returns:** object

---

### BSONMinKey

▸ **BSONMinKey**(): object

_Defined in [src/bson_types.ts:120](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L120)_

**Returns:** object

---

### BSONNull

▸ **BSONNull**(): object

_Defined in [src/bson_types.ts:25](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L25)_

**Returns:** object

---

### BSONSymbol

▸ **BSONSymbol**(`value`: string \| symbol): object

_Defined in [src/bson_types.ts:61](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L61)_

#### Parameters:

| Name    | Type             |
| ------- | ---------------- |
| `value` | string \| symbol |

**Returns:** object

| Name    | Type                |
| ------- | ------------------- |
| `value` | undefined \| string |

---

### BSONTimestamp

▸ **BSONTimestamp**(`value`: bigint): object

_Defined in [src/bson_types.ts:97](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L97)_

#### Parameters:

| Name    | Type   |
| ------- | ------ |
| `value` | bigint |

**Returns:** object

| Name    | Type   |
| ------- | ------ |
| `value` | bigint |

---

### BSONUndefined

▸ **BSONUndefined**(): object

_Defined in [src/bson_types.ts:14](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bson_types.ts#L14)_

**Returns:** object

---

### bsonDescriptorFrom

▸ **bsonDescriptorFrom**(`value`: any): [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)

_Defined in [src/bytesify.ts:27](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L27)_

Create a value descriptor that explains the BSON value.

#### Parameters:

| Name    | Type |
| ------- | ---- |
| `value` | any  |

**Returns:** [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)

---

### bytesify

▸ **bytesify**(`map`: [Map](#map)\<string, { size: number ; type: number ; value: any }> \| any): Uint8Array

_Defined in [src/bytesify.ts:138](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L138)_

#### Parameters:

| Name  | Type                                                                      |
| ----- | ------------------------------------------------------------------------- |
| `map` | [Map](#map)\<string, { size: number ; type: number ; value: any }> \| any |

**Returns:** Uint8Array

---

### calculateSize

▸ **calculateSize**(`map`: [Map](#map)\<string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)>): number

_Defined in [src/bytesify.ts:164](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L164)_

#### Parameters:

| Name  | Type                                                                          |
| ----- | ----------------------------------------------------------------------------- |
| `map` | [Map](#map)\<string, [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)> |

**Returns:** number

---

### convertPOJOtoMap

▸ **convertPOJOtoMap**(`document`: Record\<string, any>): [Map](#map)\<any, any>

_Defined in [src/bytesify.ts:18](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L18)_

Convert a Plain Javascript Object to a map with typing information.

#### Parameters:

| Name       | Type                 | Description        |
| ---------- | -------------------- | ------------------ |
| `document` | Record\<string, any> | a simple js object |

**Returns:** [Map](#map)\<any, any>

---

### getCString

▸ **getCString**(`sequence`: Uint8Array, `index`: number): object

_Defined in [src/parser.ts:137](https://github.com/nbbeeken/bsonio/blob/88408dd/src/parser.ts#L137)_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `sequence` | Uint8Array |
| `index`    | number     |

**Returns:** object

| Name      | Type   |
| --------- | ------ |
| `cString` | string |
| `size`    | number |

---

### getString

▸ **getString**(`sequence`: Uint8Array, `index`: number, `size`: number): string

_Defined in [src/parser.ts:148](https://github.com/nbbeeken/bsonio/blob/88408dd/src/parser.ts#L148)_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `sequence` | Uint8Array |
| `index`    | number     |
| `size`     | number     |

**Returns:** string

---

### mapToArray

▸ **mapToArray**(`map`: [Map](#map)\<string, any>): any[]

_Defined in [src/parser.ts:152](https://github.com/nbbeeken/bsonio/blob/88408dd/src/parser.ts#L152)_

#### Parameters:

| Name  | Type                      |
| ----- | ------------------------- |
| `map` | [Map](#map)\<string, any> |

**Returns:** any[]

---

### parse

▸ **parse**(`sequence`: Uint8Array): object

_Defined in [src/parser.ts:4](https://github.com/nbbeeken/bsonio/blob/88408dd/src/parser.ts#L4)_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `sequence` | Uint8Array |

**Returns:** object

---

### parse_to_map

▸ **parse_to_map**(`sequence`: Uint8Array, `offset`: number): [BSONDocument](#classesbsondocumentmd)

_Defined in [src/parser.ts:16](https://github.com/nbbeeken/bsonio/blob/88408dd/src/parser.ts#L16)_

Read BSON Bytes and produce a map with information about the BSON.

#### Parameters:

| Name       | Type       | Default value | Description |
| ---------- | ---------- | ------------- | ----------- |
| `sequence` | Uint8Array | -             | bson bytes  |
| `offset`   | number     | 0             | -           |

**Returns:** [BSONDocument](#classesbsondocumentmd)

---

### utf8StringLength

▸ **utf8StringLength**(`str`: string): number

_Defined in [src/bytesify.ts:160](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L160)_

#### Parameters:

| Name  | Type   |
| ----- | ------ |
| `str` | string |

**Returns:** number

---

### writeBSONValue

▸ **writeBSONValue**(`array`: Uint8Array, `index`: number, `descriptor`: [BSONValueDescriptor](#interfacesbsonvaluedescriptormd)): void

_Defined in [src/bytesify.ts:181](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L181)_

#### Parameters:

| Name         | Type                                                    |
| ------------ | ------------------------------------------------------- |
| `array`      | Uint8Array                                              |
| `index`      | number                                                  |
| `descriptor` | [BSONValueDescriptor](#interfacesbsonvaluedescriptormd) |

**Returns:** void

---

### writeCString

▸ **writeCString**(`buffer`: Uint8Array, `index`: number, `cString`: string): number

_Defined in [src/bytesify.ts:174](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L174)_

#### Parameters:

| Name      | Type       |
| --------- | ---------- |
| `buffer`  | Uint8Array |
| `index`   | number     |
| `cString` | string     |

**Returns:** number

# Interfaces

<a name="interfacesbsonvaluedescriptormd"></a>

**bsonio**

[README](#readmemd) / [Globals](#globalsmd) / BSONValueDescriptor

## Interface: BSONValueDescriptor

### Hierarchy

- **BSONValueDescriptor**

### Index

#### Properties

- [bytes](#bytes)
- [size](#size)
- [type](#type)
- [value](#value)

### Properties

#### bytes

• `Optional` **bytes**: Uint8Array

_Defined in [src/bytesify.ts:11](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L11)_

In order to calculate the size this value had to be made into bytes, here's the results for your convenience

---

#### size

• **size**: number

_Defined in [src/bytesify.ts:9](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L9)_

---

#### type

• **type**: number

_Defined in [src/bytesify.ts:7](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L7)_

---

#### value

• **value**: any

_Defined in [src/bytesify.ts:8](https://github.com/nbbeeken/bsonio/blob/88408dd/src/bytesify.ts#L8)_
