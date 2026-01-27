import { logger } from '@/application/logs/logger';
import { env } from '@/application/utils/env';
import { runMigrations } from '@/infrastructure/database/setup/db.util';
import { handleError } from '@/presentation/http/middlewares/error-handler.middleware';
import { userRoutes } from '@/presentation/http/routes/user.routes';
import openapi from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { z } from 'zod';
import { version } from '../../package.json';

main();
async function main() {
	if (env.MIGRATIONS) {
		await runMigrations();
	}
	const versionApi = '/v1';
	const app = new Elysia()
		.group(versionApi, (app) =>
			app
				.get('/health', () => {
					return {
						message: 'Server is running',
					};
				})
				.use(
					openapi({
						path: '/docs',
						documentation: {
							info: {
								title: 'API Documentation',
								version: version,
							},
							servers: [
								{
									url: versionApi,
									description: 'API Version 1',
								},
							],
						},
						mapJsonSchema: {
							zod: z.toJSONSchema,
						},
					}),
				)
				.onError(handleError)
				.use(userRoutes),
		)
		.listen(Bun.env.PORT || 3000);
	logger.info(
		`🚀 Server is running, route health: http://${app.server?.hostname}:${Bun.env.PORT || 3000}${versionApi}/health`,
	);
}
