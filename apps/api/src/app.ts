import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'

import authRoutes from '@/routes/auth'
import notesRoutes from '@/routes/notes'
import usersRoutes from '@/routes/users'

import env from '@/lib/env'

const app = new Hono()

	.use(logger())

	.use(
		cors({
			origin: env.CLIENT_ORIGIN,
			credentials: true,
		})
	)

	.notFound((c) => {
		throw new HTTPException(404, {
			res: c.json({ message: `Route ${c.req.path} not found` }),
		})
	})
	.onError((err, c) => {
		console.error(err.message)
		throw new HTTPException(500, {
			res: c.json({ message: 'Internal Server Error' }),
		})
	})

	.get('/', (c) => c.json({ message: 'Hello from React-Hono-Turbo API' }))
	.get('/health', (c) => c.json({ message: 'Health OK' }))

	.basePath('/api')
	.route('/users', usersRoutes)
	.route('/auth', authRoutes)
	.route('/notes', notesRoutes)

export default app
