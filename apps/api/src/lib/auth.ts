import { eq } from 'drizzle-orm'
import { Context } from 'hono'
import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { SignJWT, jwtVerify } from 'jose'

import { db } from '@/db'
import { userTable } from '@/db/schema'

import env from '@/lib/env'
import { tryCatch } from '@/lib/utils'

import { TUser } from '@/types'

export interface IAuthEnv {
	Variables: { user: TUser }
}

export function verifyAuth() {
	return createMiddleware<IAuthEnv>(async (c, next) => {
		if (c.req.method !== 'GET') {
			if (env.CLIENT_ORIGIN !== c.req.header('Origin')) {
				throw new HTTPException(403, {
					res: c.json({ message: 'Forbidden' }),
				})
			}
		}

		c.set('user', await verifySession(c))

		await next()
	})
}

export async function encrypt(userId: number) {
	return new SignJWT({ userId })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(new Date(Date.now() + env.TOKEN_EXP))
		.sign(new TextEncoder().encode(env.TOKEN_SECRET))
}

export async function decrypt<T>(session = '') {
	const [result, error] = await tryCatch(
		jwtVerify<T>(session, new TextEncoder().encode(env.TOKEN_SECRET), {
			algorithms: ['HS256'],
		})
	)
	if (error) {
		return null
	}

	return result.payload
}

export async function createSession(c: Context, userId: number) {
	const session = await encrypt(userId)
	await setSignedCookie(c, 'session', session, env.COOKIE_SECRET, {
		httpOnly: true,
		secure: true,
		partitioned: true,
		sameSite: 'none',
		expires: new Date(Date.now() + env.COOKIE_EXP),
	})
}

export async function verifySession(c: Context) {
	const cookie = await getSignedCookie(c, env.COOKIE_SECRET, 'session')
	if (!cookie)
		throw new HTTPException(401, {
			res: c.json({ message: 'Unauthorized' }),
		})

	const session = await decrypt<{ userId: number }>(cookie)
	if (!session)
		throw new HTTPException(401, {
			res: c.json({ message: 'Unauthorized' }),
		})

	const fullUser = await db.query.userTable.findFirst({
		where: eq(userTable.id, session.userId),
	})
	if (!fullUser)
		throw new HTTPException(401, {
			res: c.json({ message: 'Unauthorized' }),
		})

	const exp = new Date(session.exp ?? 0)
	if (Date.now() > exp.getTime() - env.COOKIE_EXP / 2) {
		await createSession(c, session.userId)
	}

	const { password: _, ...user } = fullUser
	return user
}

export function deleteSession(c: Context) {
	deleteCookie(c, 'session', {
		httpOnly: true,
		secure: true,
		partitioned: true,
		sameSite: 'none',
		signingSecret: env.COOKIE_SECRET,
	})
}
