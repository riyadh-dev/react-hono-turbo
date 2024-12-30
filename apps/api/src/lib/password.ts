import { scryptAsync } from '@noble/hashes/scrypt'
import { decodeHex, encodeHexLowerCase } from '@oslojs/encoding'
import { getRandomValues } from 'uncrypto'

export const hashPassword = async (password: string) => {
	const salt = encodeHexLowerCase(getRandomValues(new Uint8Array(16)))
	const key = await generateKey(password, salt)
	return `${salt}:${encodeHexLowerCase(key)}`
}

export const verifyPassword = async ({
	hash,
	password,
}: {
	hash: string
	password: string
}) => {
	const [salt, key] = hash.split(':')
	const targetKey = await generateKey(password, salt)
	return constantTimeEqual(targetKey, decodeHex(key))
}

async function generateKey(password: string, salt: string) {
	return await scryptAsync(password.normalize('NFKC'), salt, {
		N: config.N,
		p: config.p,
		r: config.r,
		dkLen: config.dkLen,
		maxmem: 128 * config.N * config.r * 2,
	})
}

function constantTimeEqual(
	a: ArrayBuffer | Uint8Array,
	b: ArrayBuffer | Uint8Array
): boolean {
	const aBuffer = new Uint8Array(a)
	const bBuffer = new Uint8Array(b)
	if (aBuffer.length !== bBuffer.length) {
		return false
	}
	let c = 0
	for (let i = 0; i < aBuffer.length; i++) {
		c |= aBuffer[i] ^ bBuffer[i] // ^: XOR operator
	}
	return c === 0
}

const config = {
	N: 16384,
	r: 16,
	p: 1,
	dkLen: 64,
} as const
