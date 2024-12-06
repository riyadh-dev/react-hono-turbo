import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import env from '@/lib/env'

import { auth } from './lib/auth'
import tasksRoutes from './routes/tasks'

const app = new Hono()

	.use(logger())

	.use(
		cors({
			origin: env.CLIENT_ORIGIN,
			credentials: true,
		})
	)

	.notFound((c) => c.json({ message: `Not found - ${c.req.path}` }, 404))
	.onError((err, c) => {
		console.error(err)
		return c.json({ message: 'Internal server error' }, 500)
	})

	.get('health', (c) => c.json({ message: 'Health OK' }))
	.basePath('api')

	.get('/auth/*', (c) => auth.handler(c.req.raw))
	.post('/auth/*', (c) => auth.handler(c.req.raw))

	.route('tasks', tasksRoutes)

export default app
