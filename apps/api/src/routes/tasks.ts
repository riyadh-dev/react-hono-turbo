import { Hono } from 'hono'

import { verifyAuth } from '@/lib/auth'

const tasksRoutes = new Hono()
	.get('/', (c) => {
		return c.json({
			tasks: ['Task 1', 'Task 2', 'Task 3'],
		})
	})
	.get('/protected', verifyAuth(), (c) => {
		return c.json({
			tasks: ['Protected Task 1', 'Protected Task 2', 'Protected Task 3'],
		})
	})

export default tasksRoutes
