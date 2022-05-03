(function (window) {
    "use strict";
    var log = Math.log;
    var LN2 = Math.LN2;
    var clz32 = window.Math.clz32 || function (x) { return 31 - log(x >>> 0) / LN2 | 0 };
    var fromCharCode = window.String.fromCharCode;
    var patchedU8Array = window.Uint8Array || Array;

    //////////////////////////////////////////////////////////////////////////////////////
    function encoderReplacer(nonAsciiChars) {
        // make the UTF string into a binary UTF-8 encoded string
        var point = nonAsciiChars.charCodeAt(0) | 0;
        if (0xD800 <= point) {
            if (point < 0xDC00) {
                var nextcode = nonAsciiChars.charCodeAt(1) | 0; // defaults to 0 when NaN, causing null replacement character

                if (0xDC00 <= nextcode && nextcode <= 0xDFFF) {
                    //point = ((point - 0xD800)<<10) + nextcode - 0xDC00 + 0x10000|0;
                    point = (point << 10) + nextcode - 0x35fdc00 | 0;
                    if (point > 0xffff)
                        return fromCharCode(
                            (0x1e/*0b11110*/ << 3) | (point >>> 18),
                            (0x2/*0b10*/ << 6) | ((point >>> 12) & 0x3f/*0b00111111*/),
                            (0x2/*0b10*/ << 6) | ((point >>> 6) & 0x3f/*0b00111111*/),
                            (0x2/*0b10*/ << 6) | (point & 0x3f/*0b00111111*/)
                        );
                } else point = 65533/*0b1111111111111101*/;//return '\xEF\xBF\xBD';//fromCharCode(0xef, 0xbf, 0xbd);
            } else if (point <= 0xDFFF) {
                point = 65533/*0b1111111111111101*/;//return '\xEF\xBF\xBD';//fromCharCode(0xef, 0xbf, 0xbd);
            }
        }
		/*if (point <= 0x007f) return nonAsciiChars;
		else */if (point <= 0x07ff) {
            return fromCharCode((0x6 << 5) | (point >>> 6), (0x2 << 6) | (point & 0x3f));
        } else return fromCharCode(
            (0xe/*0b1110*/ << 4) | (point >>> 12),
            (0x2/*0b10*/ << 6) | ((point >>> 6) & 0x3f/*0b00111111*/),
            (0x2/*0b10*/ << 6) | (point & 0x3f/*0b00111111*/)
        );
    }
    function TextEncoder() { };
    TextEncoder.prototype.encode = function (inputString) {
        // 0xc0 => 0b11000000; 0xff => 0b11111111; 0xc0-0xff => 0b11xxxxxx
        // 0x80 => 0b10000000; 0xbf => 0b10111111; 0x80-0xbf => 0b10xxxxxx
        var encodedString = inputString === void 0 ? "" : ("" + inputString).replace(/[\x80-\uD7ff\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g, encoderReplacer);
        var len = encodedString.length | 0, result = new patchedU8Array(len);
        var i = 0;
        for (; i < len; i = i + 1 | 0)
            result[i] = encodedString.charCodeAt(i) | 0;
        return result;
    };

    window.TextEncoder = TextEncoder;
})(globalThis);

const inspect = (object) => {
    return JSON.stringify(object, (k, val) => {
        if (typeof val === 'bigint') return val.toString() + 'n'
        if (ArrayBuffer.isView(val)) return { $buffer: toHexString(val) }
        if (val instanceof Map) return val.toRecord()
        if (val === undefined) return "undef"
        return val
    }, 2)
}

const e = new TextEncoder()
/**
 * @param {string} utf16String
 * @returns {Uint8Array}
 */
const encode_utf8 = (utf16String) => e.encode(utf16String)

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
const decode_utf8 = (bytes) => decodeURIComponent(escape(Array.from(bytes).map(b => String.fromCharCode(b)).join('')))


export function toHexString(buffer) {
    const hex = []
    for (let i = 0; i < buffer.length; i += 1) {
        const byte = buffer[i]
        hex.push(byte.toString(16).padStart(2, '0'))
    }
    return hex.join('')
}

/**
 * A helper to calculate the byte size of a string (including null)
 *
 * ```js
 * const x = stringToUTF8HexBytes('ab') // { x: '03000000616200' }
 *
 * @param string - representing what you want to encode into BSON
 * @returns BSON string with byte size encoded
 */
export const stringToUTF8HexBytes = str => {
    const b = encode_utf8(str)
    const len = b.byteLength
    const ab = new ArrayBuffer(len + 4 + 1)
    const out = new Uint8Array(ab)
    const dv = new DataView(ab)
    dv.setInt32(0, len + 1, true)
    out.set(b, 4)
    out[len + 4 + 1] = 0x00
    return toHexString(out)
}

/**
 * A helper to turn hex string sequences into BSON.
 * Omit the first 8 hex digits for the document it will be calculated
 * As well as the BSON document's null terminator '00'
 *
 * @example
 * ```js
 * const bytes = bufferFromHexArray([
 *   '10', // int32 type
 *   '6100', // 'a' key with key null terminator
 *   '01000000' // little endian int32
 * ])
 * BSON.serialize(bytes) // { a: 1 }
 * ```
 *
 * @param {string[]} array - sequences of hex digits broken up to be human readable
 * @returns
 */
export const bufferFromHexArray = array => {
    const string = array.concat(['00']).join('')
    const size = string.length / 2 + 4

    const byteLength = [size & 0xff, (size >> 8) & 0xff, (size >> 16) & 0xff, (size >> 24) & 0xff]
        .map(n => {
            const hexCode = n.toString(16)
            return hexCode.length === 2 ? hexCode : '0' + hexCode
        })
        .join('')

    const hex = byteLength + string

    const a = new Uint8Array(size)
    for (let i = 0, j = 0; i < hex.length; i += 2, j++) {
        const byte = parseInt(`${hex[i]}${hex[i + 1]}`, 16)
        a[j] = byte
    }
    return a
}


// const map = new BSONDocument()
// // print(map)
const buf = bufferFromHexArray([
    '10', // int32 type
    '6100', // 'a' key with key null terminator
    '01000000', // little endian int32
    '08', // bool type
    '6200', // 'b' key with key null terminator
    '01', // true -false

    '03', // doc
    '6300', // 'c'
    toHexString(bufferFromHexArray([
        '10', // int32 type
        '6100', // 'a' key with key null terminator
        '01000000', // little endian int32
        '08', // bool type
        '6200', // 'b' key with key null terminator
        '01', // true
    ])),

    '04', // array
    '6400', // 'd'
    toHexString(bufferFromHexArray([
        '10', // int32 type
        '3000', // 'a' key with key null terminator
        '01000000', // little endian int32
        '08', // bool type
        '3100', // 'b' key with key null terminator
        '01', // true
    ])),

    '02',
    '6500',
    ...stringToUTF8HexBytes('idea'),

    '06',
    '6600',
    '0A',
    '6700',

    'FF',
    '6800',
    '7F',
    '6900',

    '01',
    '6A00',
    'AE47E17A14AEF33F',

    '12',
    '6B00',
    '7C112097FAFFFFFF',

    '11',
    '6C00',
    '7C112097FAFFFFFF',

    '13',
    '6D00',
    '7b000000000000000000000000003c30',

    '05',
    '6E00',
    ...[
        '10000000',
        '04',
        'F4B7D6E1D9134F388BC69A473B41CB6E'
    ],

    '07',
    '6F00',
    '0102030405060708090A0B0C',

    '0b',
    '7000',
    '61626300', '696d7800',

    '09',
    '7100',
    '001EB208C2DC0000',

    '0C',
    '7200',
    ...stringToUTF8HexBytes('ns'), '0102030405060708090A0B0C',

    '0F',
    '7300',
    ...['1D000000',
        ...['09000000', '2829203D3E207B7D00'],
        ...['0C000000', '1061000100000000']
    ],

    '02',
    '7400',
    ...stringToUTF8HexBytes('😁'), // 0xf0, 0x9f, 0x98, 0x81

    '10',
    '75F09F988100',
    '01000000', // 0xf0, 0x9f, 0x98, 0x81
])

// const doc = BSONDocument.from(buf)
// console.log(doc)
// const rec = doc.toRecord()
// console.log(inspect(rec))
// console.log(JSON.stringify(JSON.parse(doc.toEJSON()), undefined, 2))
import { bsonDocument } from '../lib/mod.js'
// const m = new Map(mappedEntriesFromBSON(buf))
// console.log(m)
// console.log(new Map(mappedEntriesFromBSON(m.get('c').bytes)))

function coolTransform (entry, parent, root) {
    if (entry){
        entry.myProp = 1
        return entry
    } else if (parent) {
        return parent
    } else if (root) {
        root.done = true
    }
}
for (let index = 0; index < 100000000; index++) {
    const doc = bsonDocument(buf, coolTransform)
    // console.log(inspect(doc, {depth: Infinity, colors: true}));
}
