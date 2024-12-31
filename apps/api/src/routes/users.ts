import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { db } from '@/db'

const usersRoutes = new Hono().get('/mock', async (c) => {
	const fullUser = await db.query.userTable.findFirst()
	if (!fullUser)
		throw new HTTPException(404, {
			res: c.json({ message: 'User not found' }),
		})

	const { password: _, ...user } = fullUser
	return c.json(user)
})

export default usersRoutes
