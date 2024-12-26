import { reset, seed } from 'drizzle-seed'

import { hashPassword } from '@/lib/password'

import { db } from '.'
import * as schema from './schema'

async function main() {
	console.log('🧹 Resting db...')
	await reset(db, schema)
	console.log('✅ Resting done!')

	console.log('🌱 Seeding...')
	const hash = await hashPassword('password')
	await seed(db, {
		users: schema.userTable,
		notes: schema.noteTable,
	}).refine((f) => ({
		users: {
			count: 5,
			with: { notes: 5 },
			columns: { password: f.default({ defaultValue: hash }) },
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
