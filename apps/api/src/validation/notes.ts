import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { noteTable } from '@/db/schema'

const insetNoteSchemaBase = createInsertSchema(noteTable, {
	id: z.coerce.number().int().min(1),
	title: z.string().min(3),
	body: z.string().min(3),
})

export const createNoteSchema = insetNoteSchemaBase.pick({
	title: true,
	body: true,
})

export const idParamSchema = insetNoteSchemaBase.pick({ id: true })
