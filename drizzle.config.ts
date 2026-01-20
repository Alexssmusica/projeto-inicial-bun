import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrl } from './src/infrastructure/database/setup/db.util';

export default defineConfig({
	schema: './src/infrastructure/database/drizzle/schema/*',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: getDatabaseUrl(),
	},
	schemaFilter: ['app'],
});
