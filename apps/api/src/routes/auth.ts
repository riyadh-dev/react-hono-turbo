import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { deleteCookie, getSignedCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

import { db } from '@/db'
import { userTable } from '@/db/schema'

import {
	generateTokens,
	setRefreshTokenCookie,
	verifyAuth,
	verifyToken,
} from '@/lib/auth'
import env from '@/lib/env'
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

		const result = await db.query.userTable.findFirst({
			where: eq(userTable.email, form.email),
		})
		if (!result)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		const { password, ...user } = result

		const isValidPassword = await verifyPassword({
			hash: password,
			password: form.password,
		})
		if (!isValidPassword)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		const { accessToken, refreshToken } = await generateTokens(user.id)

		await setRefreshTokenCookie(c, refreshToken)

		return c.json({ user, accessToken })
	})

	.put('/refresh', async (c) => {
		const oldRefreshToken = await getSignedCookie(
			c,
			env.COOKIE_SECRET,
			'refreshToken'
		)
		if (!oldRefreshToken)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		const {
			payload: { userId },
		} = await verifyToken<{ userId: number }>(
			c,
			oldRefreshToken,
			env.REFRESH_TOKEN_SECRET
		)

		const fullUser = await db.query.userTable.findFirst({
			where: eq(userTable.id, userId),
		})
		if (!fullUser)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		const { accessToken, refreshToken } = await generateTokens(userId)

		await setRefreshTokenCookie(c, refreshToken)

		const { password: _, ...user } = fullUser

		return c.json({ user, accessToken })
	})

	.delete('/sign-out', verifyAuth(), (c) => {
		deleteCookie(c, 'refreshToken')
		return c.json({ message: 'Signed out successfully' })
	})

export default authRoutes
