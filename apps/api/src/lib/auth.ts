import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import { db } from '@/db'

import env from '@/lib/env'

export const auth = betterAuth({
	emailAndPassword: { enabled: true },
	trustedOrigins: [env.CLIENT_ORIGIN],
	database: drizzleAdapter(db, { provider: 'pg' }),
	user: { modelName: 'usersTable' },
	session: { modelName: 'sessionsTable' },
	account: { modelName: 'accountsTable' },
	verification: { modelName: 'verificationsTable' },
})

type TSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

interface IAuthEnv {
	Variables: {
		user: TSession['user']
		session: TSession['session']
	}
}

export function verifyAuth() {
	return createMiddleware<IAuthEnv>(async (c, next) => {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		})
		if (!session) {
			const res = new Response('Unauthorized', {
				status: 401,
			})
			throw new HTTPException(401, { res })
		}

		c.set('user', session.user)
		c.set('session', session.session)

		await next()
	})
}
