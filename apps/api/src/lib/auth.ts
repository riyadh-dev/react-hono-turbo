import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import { db } from '@/db'

import env from '@/lib/env'

export const auth = betterAuth({
	emailAndPassword: { enabled: true },
	trustedOrigins: env.CLIENT_ORIGINS,
	database: drizzleAdapter(db, { provider: 'pg' }),
	user: { modelName: 'usersTable' },
	account: { modelName: 'accountsTable' },
	verification: { modelName: 'verificationsTable' },
	session: {
		modelName: 'sessionsTable',
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60,
		},
	},
})

export interface IAuthEnv {
	Variables: (typeof auth.$Infer)['Session']
}

export function verifyAuth() {
	return createMiddleware<IAuthEnv>(async (c, next) => {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		})
		if (!session)
			throw new HTTPException(401, {
				res: c.json({ message: 'Unauthorized' }),
			})

		c.set('user', session.user)
		c.set('session', session.session)

		await next()
	})
}
