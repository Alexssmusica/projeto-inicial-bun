import { handleError } from '@/presentation/http/middlewares/error-handler.middleware';
import { userRoutes } from '@/presentation/http/routes/user.routes';
import openapi from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { z } from 'zod';

const app = new Elysia()
	.get('/', () => {
		return {
			message: 'Server is running',
		};
	})
	.use(
		openapi({
			mapJsonSchema: {
				zod: z.toJSONSchema,
			},
		}),
	)
	.onError(handleError)
	.use(userRoutes)
	.listen(Bun.env.PORT || 3000);

console.log(`🚀 Server is running at http://${app.server?.hostname}:${Bun.env.PORT || 3000}`);
