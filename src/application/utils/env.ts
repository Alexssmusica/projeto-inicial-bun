import { logger } from '../logs/logger';

function getEnv(varName: string, isObrigatorio = false): string | undefined {
	const envVar = Bun.env[varName];
	if (isObrigatorio && !envVar) {
        const erro = `Necessário criar variável ${varName} no arquivo .env`;
		logger.error(erro);
		throw new Error(erro);
	}
    if (!envVar) return undefined;
	return String(envVar);
}

function getEnvString(varName: string, isObrigatorio = false): string {
	const valor = getEnv(varName, isObrigatorio);
	return valor ? valor.trim() : '';
}

function getEnvBoolean(varName: string, isObrigatorio = false): boolean {
	const valor = getEnv(varName, isObrigatorio);
	return valor ? valor.trim().toLowerCase() === 'true' : false;
}

function getEnvNumber(varName: string, isObrigatorio = false): number {
	const valor = getEnv(varName, isObrigatorio);
	return valor ? Number(valor.trim()) : 0;
}

export const env = {
	DATABASE_URL: getEnvString('DATABASE_URL', true),
	DATABASE_TEST_URL: getEnvString('DATABASE_TEST_URL'),
	MIGRATIONS: getEnvBoolean('MIGRATIONS'),
	NODE_ENV: getEnvString('NODE_ENV'),
	PORT: getEnvNumber('PORT'),
};
