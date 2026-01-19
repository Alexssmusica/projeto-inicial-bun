import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/infrastructure/database/drizzle/schema/*',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: Bun.env.DATABASE_URL!,
	},
	schemaFilter: ['app'],
});
