import { randomUUIDv7 } from 'bun';
import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app';

 const users = appSchema.table('users', {
	id: uuid('id').primaryKey().$defaultFn(() => randomUUIDv7()),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export { users };

