import { handle } from 'hono/vercel'

import app from '../build/src/app.js'

export const config = {
	runtime: 'edge',
}

export default handle(app)
