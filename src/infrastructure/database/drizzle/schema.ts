import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const appSchema = pgSchema('app');

export const users = appSchema.table('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
