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
	const url = Bun.env.DATABASE_URL;
	if (!url) {
		throw new Error(
			'DATABASE_URL não está definida. Configure a variável de ambiente DATABASE_URL.',
		);
	}
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
