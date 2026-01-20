import { Client } from 'pg';

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

export function getDatabaseUrl(): string {
	const databaseUrl = IS_TEST ? Bun.env.DATABASE_TEST_URL : Bun.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error(
			IS_TEST
				? 'DATABASE_TEST_URL não está definida para testes'
				: 'DATABASE_URL não está definida',
		);
	}
	return databaseUrl;
}

export const IS_TEST = Bun.env.NODE_ENV === 'test';
