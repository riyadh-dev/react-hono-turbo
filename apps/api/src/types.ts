import { InferSelectModel } from 'drizzle-orm'

import { sessionTable, userTable } from './db/schema'

export type TUser = InferSelectModel<typeof userTable>

export type TSession = InferSelectModel<typeof sessionTable>

export type TSessionValidationResult =
	| { session: TSession; user: TUser }
	| { session: null; user: null }
