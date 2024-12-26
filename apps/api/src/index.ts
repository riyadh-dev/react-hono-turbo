import { serve } from '@hono/node-server'

import env from '@/lib/env'

import app from '@/app'

serve({ fetch: app.fetch, port: env.API_PORT })

console.log(
	env.NODE_ENV === 'production'
		? `Prod: On Port ${env.API_PORT.toString()}:`
		: `Dev: http://localhost:${env.API_PORT.toString()}/api`
)
