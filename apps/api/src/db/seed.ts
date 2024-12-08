import { scryptAsync } from '@noble/hashes/scrypt'
import { reset, seed } from 'drizzle-seed'
import { decodeHex, encodeHex } from 'oslo/encoding'
import { getRandomValues } from 'uncrypto'

import { db } from '.'
import * as schema from './schema'

async function main() {
	console.log('🧹 Resting db...')
	await reset(db, schema)
	console.log('✅ Resting done!')

	console.log('🌱 Seeding...')
	const hash = await hashPassword('password')
	await seed(db, {
		users: schema.usersTable,
		accounts: schema.accountsTable,
		notes: schema.notesTable,
	}).refine((f) => ({
		users: { count: 5, with: { accounts: 1, notes: 5 } },
		accounts: {
			columns: {
				providerId: f.default({ defaultValue: 'credential' }),
				accountId: f.default({ defaultValue: '_' }),
				idToken: f.default({ defaultValue: null }),
				accessToken: f.default({ defaultValue: null }),
				refreshToken: f.default({ defaultValue: null }),
				accessTokenExpiresAt: f.default({ defaultValue: null }),
				refreshTokenExpiresAt: f.default({ defaultValue: null }),
				password: f.default({ defaultValue: hash }),
			},
		},
		notes: {
			columns: {
				title: f.loremIpsum({ sentencesCount: 1 }),
				body: f.loremIpsum({ sentencesCount: 4 }),
			},
		},
	}))
	console.log('✅ Seeding done!')

	process.exit(0)
}

main().catch(console.error)

export function constantTimeEqual(
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

export const hashPassword = async (password: string) => {
	const salt = encodeHex(getRandomValues(new Uint8Array(16)))
	const key = await generateKey(password, salt)
	return `${salt}:${encodeHex(key)}`
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
