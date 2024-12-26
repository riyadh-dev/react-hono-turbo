import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { db } from '@/db'
import { noteTable } from '@/db/schema'

import { verifyAuth } from '@/lib/auth'

import { createNoteSchema, idParamSchema } from '@/validation/notes'

const notesRoutes = new Hono()

	.use(verifyAuth())

	.post('/', zValidator('form', createNoteSchema), async (c) => {
		const form = c.req.valid('form')

		const [{ noteId }] = await db
			.insert(noteTable)
			.values({
				userId: c.var.user.id,
				title: form.title,
				body: form.body,
			})
			.returning({ noteId: noteTable.id })

		return c.json({
			noteId,
			message: 'Note created',
		})
	})

	.put(
		'/:id',
		zValidator('param', idParamSchema),
		zValidator('form', createNoteSchema),
		async (c) => {
			const note = await db.query.noteTable.findFirst({
				where: eq(noteTable.id, c.req.valid('param').id),
			})

			if (!note)
				throw new HTTPException(404, {
					res: c.json({ message: 'Note not found' }),
				})

			if (note.userId !== c.var.user.id)
				throw new HTTPException(401, {
					res: c.json({ message: 'Unauthorized' }),
				})

			const form = c.req.valid('form')

			await db
				.update(noteTable)
				.set({
					title: form.title,
					body: form.body,
				})
				.where(eq(noteTable.id, c.req.valid('param').id))

			return c.json({
				message: 'Note updated',
			})
		}
	)

	.get('/', async (c) =>
		c.json(
			await db.query.noteTable.findMany({
				where: eq(noteTable.userId, c.var.user.id),
			})
		)
	)

	.get('/:id', zValidator('param', idParamSchema), async (c) => {
		const note = await db.query.noteTable.findFirst({
			where: eq(noteTable.id, c.req.valid('param').id),
		})

		if (!note)
			throw new HTTPException(404, {
				res: c.json({ message: 'Note not found' }),
			})

		return c.json(note)
	})

	.delete('/:id', zValidator('param', idParamSchema), async (c) => {
		const note = await db.query.noteTable.findFirst({
			where: eq(noteTable.id, c.req.valid('param').id),
		})

		if (!note)
			throw new HTTPException(404, {
				res: c.json({ message: 'Note not found' }),
			})

		if (note.userId !== c.var.user.id)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		await db.delete(noteTable).where(eq(noteTable.id, note.id))

		return c.json({ message: 'Note deleted' })
	})

export default notesRoutes
