import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { notesTable } from '@/db/schema'

const insetNoteSchemaBase = createInsertSchema(notesTable)

export const createNoteSchema = insetNoteSchemaBase.pick({
	title: true,
	body: true,
})

export const idParamSchema = z.object({
	id: z.coerce.number().int().min(1),
})
