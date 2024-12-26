import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const noteTable = pgTable('note', {
	id: serial('id').primaryKey(),
	title: text().notNull(),
	body: text().notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date()),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
})

export const userTable = pgTable('user', {
	id: serial().primaryKey(),
	email: text().notNull().unique(),
	username: text().notNull(),
	password: text().notNull(),
})

export const sessionTable = pgTable('session', {
	id: text().primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
})
