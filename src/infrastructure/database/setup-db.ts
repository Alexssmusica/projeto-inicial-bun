import { setupDatabase } from './setup';

async function main() {
	try {
		await setupDatabase();
		process.exit(0);
	} catch (error) {
		console.error('Falha ao configurar o banco de dados:', error);
		process.exit(1);
	}
}
main();
