export interface BSONCorpusSuite {
    fileName: string;
    /** human-readable description of what is in the file */
    description: string
    /** hex string of the first byte of a BSON element (e.g. "0x01" for type "double"); this will be the synthetic value "0x00" for "whole document" tests like top.json. */
    bson_type: string
    /** (optional) name of a field in a single - BSON - type valid test case that contains the data type being tested */
    test_key?: string
    /** an array of validity test cases */
    valid?: ValidTest[]
    /** an array of decode error cases */
    decodeErrors?: DecodeTest[]
    /** An array of type - specific parse error case */
    parseErrors?: any[]
    /** this field will be present(and true) if the BSON type has been deprecated(i.e.Symbol, Undefined and DBPointer) */
    deprecated?: true
}


export interface ValidTest {
    /**: human-readable test case label. */
    description: string
    /**: an (uppercase) big-endian hex representation of a BSON byte string. Be sure to mangle the case as appropriate in any roundtrip tests. */
    canonical_bson: string
    bytes_canonical_bson: Uint8Array
    /**: a string containing a Canonical Extended JSON document. Because this is itself embedded as a string inside a JSON document, characters like quote and backslash are escaped. */
    canonical_extjson: string
    /**: (optional) a string containing a Relaxed Extended JSON document. Because this is itself embedded as a string inside a JSON document, characters like quote and backslash are escaped. */
    relaxed_extjson?: string
    /**: (optional) an (uppercase) big-endian hex representation of a BSON byte string that is technically parseable, but not in compliance with the BSON spec. Be sure to mangle the case as appropriate in any roundtrip tests. */
    degenerate_bson?: string
    /**: (optional) a string containing an invalid form of Canonical Extended JSON that is still parseable according to type-specific rules. (For example, "1e100" instead of "1E+100".) */
    degenerate_extjson?: string
    /**: (optional) an (uppercase) big-endian hex representation of a BSON byte string. It may be present for deprecated types. It represents a possible conversion of the deprecated type to a non-deprecated type, e.g. symbol to string. */
    converted_bson?: string
    /**: (optional) a string containing a Canonical Extended JSON document. Because this is itself embedded as a string inside a JSON document, characters like quote and backslash are escaped. It may be present for deprecated types and is the Canonical Extended JSON representation of converted_bson. */
    converted_extjson?: string
    /** (optional) -- boolean; present (and true) iff canonical_bson can't be represented exactly with extended JSON (e.g. NaN with a payload). */
    lossy?: true
}

export interface DecodeTest {
    /**: human-readable test case label.*/
    description: string
    /**: an (uppercase) big-endian hex representation of an invalid BSON string that should fail to decode correctly.*/
    bson: string
    bytes_bson: Uint8Array
}
