import { hc } from 'hono/client'

import app from '@/app'

export type Client = ReturnType<typeof hc<typeof app>>

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
	hc<typeof app>(...args)
