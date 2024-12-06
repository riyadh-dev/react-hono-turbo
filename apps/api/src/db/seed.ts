import { reset, seed } from 'drizzle-seed'

import { db } from '.'
import * as schema from './schema'

async function main() {
	console.log('🧹 Resting db...')
	await reset(db, schema)
	console.log('✅ Resting done!')

	console.log('🌱 Seeding...')
	await seed(db, schema, { count: 20 })
	console.log('✅ Seeding done!')

	process.exit(0)
}

main().catch(console.error)
