import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { db } from '@/db'
import { notesTable } from '@/db/schema'

import { verifyAuth } from '@/lib/auth'

import { createNoteSchema, idParamSchema } from '@/validation/notes'

const notesRoutes = new Hono()

	.use(verifyAuth())

	.post('/', zValidator('form', createNoteSchema), async (c) => {
		const form = c.req.valid('form')

		const [{ noteId }] = await db
			.insert(notesTable)
			.values({
				userId: c.var.user.id,
				title: form.title,
				body: form.body,
			})
			.returning({ noteId: notesTable.id })

		return c.json({
			noteId,
			message: 'Note created',
		})
	})

	.get('/', async (c) =>
		c.json(
			await db.query.notesTable.findMany({
				where: eq(notesTable.userId, c.var.user.id),
			})
		)
	)

	.get('/:id', zValidator('param', idParamSchema), async (c) => {
		const note = await db.query.notesTable.findFirst({
			where: eq(notesTable.id, c.req.valid('param').id),
		})

		if (!note)
			throw new HTTPException(404, {
				res: c.json({ message: 'Note not found' }),
			})

		return c.json(note)
	})

export default notesRoutes
