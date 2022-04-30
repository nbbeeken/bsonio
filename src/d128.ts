import { BSONDataView } from './mod.js'

const EXPONENT_MAX = 6111n
const EXPONENT_MIN = -6176n
const EXPONENT_BIAS = 6176n
const MAX_DIGITS = 34
const PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/u
const PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/iu
const PARSE_NAN_REGEXP = /^(\+|-)?NaN$/iu
const EXPONENT_REGEX = /^([-+])?(\d+)?$/u
// Nan value bits as 32 bit values (due to lack of longs)
const NAN_BUFFER = new Uint8Array(
	[0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse()
)
// Infinity value bits 32 bit values (due to lack of longs)
const INF_NEGATIVE_BUFFER = new Uint8Array(
	[0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse()
)
const INF_POSITIVE_BUFFER = new Uint8Array(
	[0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse()
)
const ASCII_ZERO = '0'.charCodeAt(0)
// Extract least significant 5 bits
const COMBINATION_MASK = 0x1fn
// Extract least significant 14 bits
const EXPONENT_MASK = 0x3fffn
// Value of combination field for Inf
const COMBINATION_INFINITY = 30n
// Value of combination field for NaN
const COMBINATION_NAN = 31n

/** Create a string representation of the raw Decimal128 value */
export const toString: (buffer: Uint8Array) => string = (buffer: Uint8Array) => {
	/*
	 * Note: bits in this routine are referred to starting at 0,
	 * from the sign bit, towards the coefficient.
	 */

	const dv = new BSONDataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)

	// Decoded biased exponent (14 bits)
	let biasedExponent = 0n
	// The number of significand digits
	let significandDigits = 0
	// The base-10 digits in the significand
	const significand = Object.seal(new Array<number>(36).fill(0))

	// True if the number is zero
	let isZero = false
	// The most significant significand bits (50-46)
	let significandMsb = 0n

	// Output string
	const string: string[] = []
	const asBigInt = dv.getBigUint128(0, true)

	if (asBigInt & 0x8000_0000_0000_0000_0000_0000_0000_0000n) {
		// Sign bit is set
		string.push('-')
	}

	/*
	 * Decode combination field and exponent
	 * bits 1 - 5
	 */
	const combination = (asBigInt >> 122n) & COMBINATION_MASK

	if (combination >> 3n === 0b11n) {
		// Check for 'special' values
		if (combination === COMBINATION_INFINITY) {
			return `${string.join('')}Infinity`
		} else if (combination === COMBINATION_NAN) {
			return 'NaN'
		}
		biasedExponent = (asBigInt >> 111n) & EXPONENT_MASK
		significandMsb = 0b1000n + ((asBigInt >> 110n) & 0b1n)
	} else {
		significandMsb = (asBigInt >> 110n) & 0b111n
		biasedExponent = (asBigInt >> 113n) & EXPONENT_MASK
	}

	// Unbiased exponent
	const exponent = Number(biasedExponent - EXPONENT_BIAS)
	// Create string of significand digits

	/*
	 * Convert the 114-bit binary number represented by
	 * (significand_high, significand_low) to at most 34 decimal
	 * digits through modulo and division.
	 */
	const maskBottomSig = asBigInt & 0x0000_3fff_ffff_ffff_ffff_ffff_ffff_ffffn
	const maskBottomMsb = significandMsb & 0xfn
	const shiftBtmMsb = maskBottomMsb << 110n
	const significand128 = shiftBtmMsb | maskBottomSig

	if (significand128 === 0n) {
		isZero = true
	} else {
		let leastDigits = significand128
		for (let digit = 35; digit >= 0; digit -= 1) {
			significand[digit] = Number(leastDigits % 10n)
			leastDigits /= 10n
		}
	}

	/*
	 * Output format options:
	 * Scientific - [-]d.dddE(+/-)dd or [-]dE(+/-)dd
	 * Regular    - ddd.ddd
	 */

	// Read pointer into significand
	let index = 0

	if (isZero) {
		significandDigits = 1
		significand[index] = 0
	} else {
		significandDigits = 36
		while (significand[index] === 0) {
			significandDigits -= 1
			index += 1
		}
	}

	// The exponent if scientific notation is used
	const scientificExponent = significandDigits - 1 + exponent

	/*
	 * The scientific exponent checks are dictated by the string conversion
	 * specification and are somewhat arbitrary cutoffs.
	 *
	 * We must check exponent > 0, because if this is the case, the number
	 * has trailing zeros.  However, we *cannot* output these trailing zeros,
	 * because doing so would change the precision of the value, and would
	 * change stored data if the string converted number is round tripped.
	 */
	if (scientificExponent >= 34 || scientificExponent <= -7 || exponent > 0) {
		// Scientific format

		/*
		 * If there are too many significant digits, we should just be treating numbers
		 * as + or - 0 and using the non-scientific exponent (this is for the "invalid
		 * representation should be treated as 0/-0" spec cases in decimal128-1.json)
		 */
		if (significandDigits > 34) {
			string.push(`${0}`)
			if (exponent > 0) {
				string.push(`E+${exponent}`)
			} else if (exponent < 0) {
				string.push(`E${exponent}`)
			}
			return string.join('')
		}

		string.push(`${significand[index]}`)
		index += 1
		significandDigits -= 1

		if (significandDigits) {
			string.push('.')
		}

		for (let remaining = 0; remaining < significandDigits; remaining += 1) {
			string.push(`${significand[index]}`)
			index += 1
		}

		// Exponent
		string.push('E')
		if (scientificExponent > 0) {
			string.push(`+${scientificExponent}`)
		} else {
			string.push(`${scientificExponent}`)
		}
	} else if (exponent >= 0) {
		// Regular format with no decimal place
		for (let remaining = 0; remaining < significandDigits; remaining += 1) {
			string.push(`${significand[index]}`)
			index += 1
		}
	} else {
		let radixPosition = significandDigits + exponent

		// Non-zero digits before radix
		if (radixPosition > 0) {
			for (let position = 0; position < radixPosition; position += 1) {
				string.push(`${significand[index]}`)
				index += 1
			}
		} else {
			string.push('0')
		}

		string.push('.')
		// Add leading zeros after radix
		// eslint-disable-next-line no-plusplus
		while (radixPosition++ < 0) {
			string.push('0')
		}

		for (let position = 0; position < significandDigits - Math.max(radixPosition - 1, 0); position += 1) {
			string.push(`${significand[index]}`)
			index += 1
		}
	}

	return string.join('')
}

const invalidErr = (string: string, message: string) => {
	throw new Error(`"${string}" is not a valid Decimal128 string - ${message}`)
}
const decimalDigits = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
const isDigit = (value: string): boolean => decimalDigits.has(value)
const parseDigit = (value: string): number => value?.charCodeAt(0) - ASCII_ZERO

/**
 * Create a Decimal128 instance from a string representation
 *
 * @param representation - a numeric string representation.
 */
export const fromString: (representation: string) => Uint8Array = (representation: string) => {
	// Parse state tracking
	let firstNonZero = 0
	let foundNonZero = false
	let isNegative = false
	// Total number of significant digits (no leading or trailing zero)
	let nDigits = 0
	// Total number of significand digits read
	let nDigitsRead = 0
	// Total number of digits (no leading zeros)
	let radixPosition = 0n
	// The number of the digits after radix
	let sawRadix = false
	// The index of the first non-zero in *str*
	let significantDigits = 0

	// Digits Array
	const digits = [0]
	// The number of digits in digits
	let digitsInsert = 0
	// Insertion pointer for digits
	let exponent = 0n
	// The index of the first non-zero digit
	let firstDigit = 0
	// The index of the last digit
	let indexLastDigit = 0
	// Exponent
	let index = 0
	// Loop index over array
	let lastDigit = 0
	// Read index
	let nDigitsStored = 0

	/*
	 * Naively prevent against REDOS attacks.
	 * TODO: implementing a custom parsing for this, or refactoring the regex would yield
	 *       further gains.
	 */
	if (representation.length >= 7000) {
		throw new Error(`${representation} not a valid Decimal128 string`)
	}

	// Results
	const stringMatch = representation.match(PARSE_STRING_REGEXP)
	const infMatch = representation.match(PARSE_INF_REGEXP)
	const nanMatch = representation.match(PARSE_NAN_REGEXP)

	// Validate the string
	if ((!stringMatch && !infMatch && !nanMatch) || representation.length === 0) {
		throw new Error(`${representation} not a valid Decimal128 string`)
	}

	if (stringMatch) {
		/*
		 * Full_match = stringMatch[0]
		 * sign = stringMatch[1]
		 *
		 * StringMatch[3] is undefined if a whole number (ex "1", 12")
		 * but defined if a number w/ decimal in it (ex "1.0, 12.2")
		 */
		const [, unsignedNumber, , eString, expSign, expNumber] = stringMatch

		// They provided e, but didn't give an exponent number. for ex "1e"
		if (eString && expNumber == null) {
			invalidErr(representation, 'missing exponent power')
		}

		// They provided e, but didn't give a number before it. for ex "e1"
		if (eString && unsignedNumber == null) {
			invalidErr(representation, 'missing exponent base')
		}

		if (eString == null && (expSign || expNumber)) {
			invalidErr(representation, 'missing e before exponent')
		}
	}

	// Get the negative or positive sign
	if (representation[index] === '+' || representation[index] === '-') {
		isNegative = representation[index] === '-'
		index += 1
	}

	// Check if user passed Infinity or NaN
	if (!isDigit(representation[index]) && representation[index] !== '.') {
		if (representation[index] === 'i' || representation[index] === 'I') {
			return isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER
		} else if (representation[index] === 'N') {
			return NAN_BUFFER
		}
	}

	// Read all the digits
	while (isDigit(representation[index]) || representation[index] === '.') {
		if (representation[index] === '.') {
			if (sawRadix) {
				invalidErr(representation, 'contains multiple periods')
			}

			sawRadix = true
			index += 1
			continue
		}

		if (nDigitsStored < 34) {
			if (representation[index] !== '0' || foundNonZero) {
				if (!foundNonZero) {
					firstNonZero = nDigitsRead
				}

				foundNonZero = true

				// Only store 34 digits
				digits[digitsInsert] = parseDigit(representation[index])
				digitsInsert += 1
				nDigitsStored += 1
			}
		}

		if (foundNonZero) {
			nDigits += 1
		}
		if (sawRadix) {
			radixPosition += 1n
		}

		nDigitsRead += 1
		index += 1
	}

	if (sawRadix && !nDigitsRead) {
		throw new Error(`${String(representation)} not a valid Decimal128 string`)
	}

	// Read exponent if exists
	if (representation[index] === 'e' || representation[index] === 'E') {
		// Read exponent digits
		index += 1
		const match = representation.substring(index).match(EXPONENT_REGEX)

		// No digits read
		if (!match || !match[2]) {
			return NAN_BUFFER
		}

		// Get exponent
		exponent = BigInt(Number.parseInt(match[0], 10))

		// Adjust the index
		index += match[0].length
	}

	// Return not a number
	if (representation[index]) {
		return Buffer.from(NAN_BUFFER)
	}

	/*
	 * Done reading input
	 * Find first non-zero digit in digits
	 */
	firstDigit = 0

	if (nDigitsStored > 0) {
		lastDigit = nDigitsStored - 1
		significantDigits = nDigits
		if (significantDigits !== 1) {
			while (digits[firstNonZero + significantDigits - 1] === 0) {
				significantDigits -= 1
			}
		}
	} else {
		firstDigit = 0
		lastDigit = 0
		digits[0] = 0
		nDigits = 1
		nDigitsStored = 1
		significantDigits = 0
	}

	/*
	 * Normalization of exponent
	 * Correct exponent based on radix position, and shift significand as needed
	 * to represent user input
	 */

	// Overflow prevention
	if (exponent <= radixPosition && radixPosition - exponent > 1 << 14) {
		exponent = EXPONENT_MIN
	} else {
		exponent -= radixPosition
	}

	// Attempt to normalize the exponent
	while (exponent > EXPONENT_MAX) {
		// Shift exponent to significand and decrease
		lastDigit += 1

		if (lastDigit - firstDigit > MAX_DIGITS) {
			// Check if we have a zero then just hard clamp, otherwise fail
			const digitsString = digits.join('')
			if (digitsString.match(/^0+$/u)) {
				exponent = EXPONENT_MAX
				break
			}

			invalidErr(representation, 'overflow')
		}
		exponent -= 1n
	}

	while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
		// Shift last digit. can only do this if < significant digits than # stored.
		if (lastDigit === 0 && significantDigits < nDigitsStored) {
			exponent = EXPONENT_MIN
			significantDigits = 0
			break
		}

		if (nDigitsStored < nDigits) {
			// Adjust to match digits not stored
			nDigits -= 1
		} else {
			// Adjust to round
			lastDigit -= 1
		}

		if (exponent < EXPONENT_MAX) {
			exponent += 1n
		} else {
			// Check if we have a zero then just hard clamp, otherwise fail
			const digitsString = digits.join('')
			if (digitsString.match(/^0+$/u)) {
				exponent = EXPONENT_MAX
				break
			}
			invalidErr(representation, 'overflow')
		}
	}

	/*
	 * Round
	 * We've normalized the exponent, but might still need to round.
	 */
	if (lastDigit - firstDigit + 1 < significantDigits) {
		let endOfString = nDigitsRead

		/*
		 * If we have seen a radix point, 'string' is 1 longer than we have
		 * documented with nDigitsRead, so inc the position of the first nonzero
		 * digit and the position that digits are read to.
		 */
		if (sawRadix) {
			firstNonZero += 1
			endOfString += 1
		}
		// If negative, we need to increment again to account for - sign at start.
		if (isNegative) {
			firstNonZero += 1
			endOfString += 1
		}

		const roundDigit = parseDigit(representation[firstNonZero + lastDigit + 1])
		let roundBit = 0

		if (roundDigit >= 5) {
			roundBit = 1
			if (roundDigit === 5) {
				roundBit = digits[lastDigit] % 2 === 1 ? 1 : 0
				for (indexLastDigit = firstNonZero + lastDigit + 2; indexLastDigit < endOfString; indexLastDigit += 1) {
					if (parseDigit(representation[indexLastDigit])) {
						roundBit = 1
						break
					}
				}
			}
		}

		if (roundBit) {
			let dIdx = lastDigit

			for (; dIdx >= 0; dIdx -= 1) {
				// eslint-disable-next-line no-plusplus
				if (++digits[dIdx] > 9) {
					digits[dIdx] = 0

					// Overflowed most significant digit
					if (dIdx === 0) {
						if (exponent < EXPONENT_MAX) {
							exponent += 1n
							digits[dIdx] = 1
						} else {
							return isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER
						}
					}
				}
			}
		}
	}

	/*
	 * Encode significand
	 * The 34 digits of the significand
	 */
	let significand = 0n

	const digitsAsBigInt = digits.map((digit) => BigInt(digit))

	if (significantDigits !== 0) {
		significand = digitsAsBigInt[firstDigit]
		for (let digitIndex = firstDigit + 1; digitIndex <= lastDigit; digitIndex += 1) {
			const digit = digitsAsBigInt[digitIndex]
			significand *= 10n
			significand += digit
		}
	}

	// Biased exponent
	const biasedExponent = exponent + EXPONENT_BIAS
	let dec = 0n

	// Encode combination, exponent, and significand.
	if (((significand >> 113n) & 1n) === 1n) {
		// Encode '11' into bits 1 to 3
		dec |= 0b11n << 125n
		dec |= (biasedExponent & 0x3fffn) << 111n
		dec |= significand & 0x7fff_ffff_ffff_ffff_ffff_ffff_ffff_ffffn
	} else {
		dec |= (biasedExponent & 0x3fffn) << 113n
		dec |= significand & 0x1fff_ffff_ffff_ffff_ffff_ffff_ffff_ffffn
	}

	// Encode sign
	if (isNegative) {
		dec |= 0x8000_0000_0000_0000_0000_0000_0000_0000n
	}

	// Encode into a buffer
	const buffer = new ArrayBuffer(16)
	const dv = new DataView(buffer)

	dv.setBigUint64(0, dec & 0xffff_ffff_ffff_ffff_ffffn, true)
	dv.setBigUint64(8, dec >> 64n, true)

	return new Uint8Array(buffer)
}

export const D128 = { fromString, toString }
