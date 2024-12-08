import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const notesTable = pgTable('notes', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: text().notNull(),
	body: text().notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date()),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
})

export const usersTable = pgTable('users', {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
})

export const sessionsTable = pgTable('sessions', {
	id: text().primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text().notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_Address'),
	userAgent: text('user_Agent'),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
})

export const accountsTable = pgTable('accounts', {
	id: text().primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text(),
	password: text(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
})

export const verificationsTable = pgTable('verifications', {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
})
