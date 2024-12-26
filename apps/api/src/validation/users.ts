import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { userTable } from '@/db/schema'

const insertUserSchemaBase = createInsertSchema(userTable, {
	email: z.string().email().toLowerCase(),
	username: z.string().min(3),
	password: z.string().min(8),
})

export const signUpSchema = insertUserSchemaBase.pick({
	email: true,
	username: true,
	password: true,
})

export const signInSchema = insertUserSchemaBase.pick({
	email: true,
	password: true,
})
