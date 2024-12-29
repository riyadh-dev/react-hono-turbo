import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { db } from '@/db'
import { userTable } from '@/db/schema'

import { createSession, deleteSession, verifyAuth } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/password'

import { signInSchema, signUpSchema } from '@/validation/users'

const authRoutes = new Hono()

	.post('/sign-up', zValidator('form', signUpSchema), async (c) => {
		const form = c.req.valid('form')

		const userWithEmail = await db.query.userTable.findFirst({
			where: eq(userTable.email, form.email),
		})
		if (userWithEmail)
			throw new HTTPException(400, {
				res: c.json({ message: 'Email already exists' }),
			})

		await db.insert(userTable).values({
			email: form.email,
			username: form.username,
			password: await hashPassword(form.password),
		})

		return c.json({
			message: 'User created successfully',
		})
	})

	.post('/sign-in', zValidator('form', signInSchema), async (c) => {
		const form = c.req.valid('form')

		const fullUser = await db.query.userTable.findFirst({
			where: eq(userTable.email, form.email),
		})
		if (!fullUser)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		const { password, ...user } = fullUser

		const isValidPassword = await verifyPassword({
			hash: password,
			password: form.password,
		})
		if (!isValidPassword)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		await createSession(c, user.id)
		return c.json({ user })
	})

	.delete('/sign-out', verifyAuth(), (c) => {
		deleteSession(c)
		return c.json({ message: 'Signed out successfully' })
	})

	.get('/me', verifyAuth(), (c) => {
		return c.json({ user: c.var.user })
	})

export default authRoutes
