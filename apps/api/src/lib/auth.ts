import { sha256 } from '@oslojs/crypto/sha2'
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from '@oslojs/encoding'
import { eq } from 'drizzle-orm'
import { Context } from 'hono'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import { db } from '@/db'
import { sessionTable, userTable } from '@/db/schema'

import env from '@/lib/env'

import { TSession, TUser } from '@/types'

export interface IAuthEnv {
	Variables: {
		user: TUser
		session: TSession
	}
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

		const cookies = await getSignedCookie(c, env.COOKIE_SECRET)
		const token = cookies.session
		if (!token) {
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})
		}

		const { session, user } = await validateSessionToken(token)
		if (!user) {
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})
		}

		await setSessionTokenCookie(c, token)

		c.set('user', user)
		c.set('session', session)

		await next()
	})
}

export async function setSessionTokenCookie(c: Context, token: string) {
	await setSignedCookie(c, 'session', token, env.COOKIE_SECRET, {
		httpOnly: true,
		sameSite: 'lax',
		expires: new Date(Date.now() + env.SESSION_EXP),
		secure: env.NODE_ENV === 'production',
	})
}

export async function deleteSessionTokenCookie(c: Context) {
	await setSignedCookie(c, 'session', '', env.COOKIE_SECRET, {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		secure: env.NODE_ENV === 'production',
	})
}

export function generateSessionToken() {
	const bytes = new Uint8Array(20)
	crypto.getRandomValues(bytes)
	const token = encodeBase32LowerCaseNoPadding(bytes)
	return token
}

export async function createSession(token: string, userId: number) {
	const sessionId = encodeHexLowerCase(
		sha256(new TextEncoder().encode(token))
	)
	const session: TSession = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + env.SESSION_EXP),
	}
	await db.insert(sessionTable).values(session)
	return session
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(
		sha256(new TextEncoder().encode(token))
	)

	const result = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.id, sessionId))
	if (result.length < 1) {
		return { session: null, user: null }
	}

	const { user, session } = result[0]

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id))
		return { session: null, user: null }
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt,
			})
			.where(eq(sessionTable.id, session.id))
	}

	return { session, user }
}

export async function invalidateSession(sessionId: string) {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}
