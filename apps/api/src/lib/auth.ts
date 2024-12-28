import { eq } from 'drizzle-orm'
import { Context } from 'hono'
import { setSignedCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { SignJWT, jwtVerify } from 'jose'

import { db } from '@/db'
import { userTable } from '@/db/schema'

import env from '@/lib/env'

import { TUser } from '@/types'

export interface IAuthEnv {
	Variables: { user: TUser }
}

export function verifyAuth() {
	return createMiddleware<IAuthEnv>(async (c, next) => {
		if (c.req.method !== 'GET') {
			if (!env.CLIENT_ORIGINS.includes(c.req.header('Origin') ?? '')) {
				throw new HTTPException(403, {
					res: c.json({ message: 'Forbidden' }),
				})
			}
		}

		const token = c.req.header('Authorization')?.replace('Bearer ', '')
		if (!token)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		const {
			payload: { userId },
		} = await verifyToken<{ userId: number }>(
			c,
			token,
			env.ACCESS_TOKEN_SECRET
		)

		const res = await db.query.userTable.findFirst({
			where: eq(userTable.id, userId),
		})
		if (!res)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		const { password: _, ...user } = res

		c.set('user', user)

		await next()
	})
}

export async function generateTokens(userId: number) {
	const textEncoder = new TextEncoder()

	const [accessToken, refreshToken] = await Promise.all([
		new SignJWT({ userId })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime(new Date(Date.now() + env.ACCESS_TOKEN_EXP))
			.sign(textEncoder.encode(env.ACCESS_TOKEN_SECRET)),

		new SignJWT({ userId })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime(new Date(Date.now() + env.REFRESH_TOKEN_EXP))
			.sign(textEncoder.encode(env.REFRESH_TOKEN_SECRET)),
	])

	return { accessToken, refreshToken }
}

export async function verifyToken<T>(
	c: Context,
	token: string,
	secret: string
) {
	try {
		return await jwtVerify<T>(token, new TextEncoder().encode(secret))
	} catch (err) {
		if (
			err instanceof Error &&
			'code' in err &&
			err.code === 'ERR_JWT_EXPIRED'
		)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		throw new HTTPException(500, {
			res: c.json({ message: 'Internal Server Error' }),
		})
	}
}

export async function setRefreshTokenCookie(c: Context, token: string) {
	await setSignedCookie(c, 'refreshToken', token, env.COOKIE_SECRET, {
		httpOnly: true,
		sameSite: 'lax',
		expires: new Date(Date.now() + env.REFRESH_TOKEN_EXP),
		secure: env.NODE_ENV === 'production',
	})
}
