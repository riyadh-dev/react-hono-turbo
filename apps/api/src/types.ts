import { InferSelectModel } from 'drizzle-orm'

import { userTable } from './db/schema'

export type TUser = Omit<InferSelectModel<typeof userTable>, 'password'>
