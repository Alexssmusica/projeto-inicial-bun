import { logger } from '@/application/logs/logger';
import { env } from '@/application/utils/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client, Pool } from 'pg';

function extractDatabaseName(url: string): string {
	const urlObj = new URL(url);
	const dbName = urlObj.pathname.slice(1);
	return dbName;
}

function getPostgresConnectionUrl(databaseUrl: string): string {
	const urlObj = new URL(databaseUrl);
	urlObj.pathname = '/postgres';
	return urlObj.toString();
}

export async function setupDatabase(): Promise<void> {
	const url = getDatabaseUrl();
	const dbName = extractDatabaseName(url);
	const postgresUrl = getPostgresConnectionUrl(url);
	const client = new Client({
		connectionString: postgresUrl,
	});
	try {
		await client.connect();
		const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
		if (result.rows.length === 0) {
			await client.query(`CREATE DATABASE "${dbName}"`);
		}
	} finally {
		await client.end();
	}
}

export async function runMigrations(): Promise<void> {
	logger.info('Running migrations...');
	await setupDatabase();
	const url = getDatabaseUrl();
	const pool = new Pool({ connectionString: url });
	const db = drizzle(pool);
	await migrate(db, { migrationsFolder: './drizzle' });
	await pool.end();
	logger.info('Migrations executed successfully');
}

export function getDatabaseUrl(): string {
	const databaseUrl = IS_TEST ? env.DATABASE_TEST_URL : env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error(
			IS_TEST
				? 'DATABASE_TEST_URL não está definida para testes'
				: 'DATABASE_URL não está definida',
		);
	}
	return databaseUrl;
}

export const IS_TEST = env.NODE_ENV === 'test';
export const IS_DEVELOPMENT = env.NODE_ENV === 'development';
