import { Elysia } from 'elysia';
import { z } from 'zod';
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { DeleteUserByIdUseCase } from '@/application/use-cases/delete-user-by-id.use-case';
import { GetUserByIdUseCase } from '@/application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '@/application/use-cases/list-users.use-case';
import { DrizzleUserRepository } from '@/infrastructure/database/adapters/drizzle-user.repository';
import { UserController } from '@/presentation/http/controllers/user.controller';

const userRepository = new DrizzleUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepository);
const userController = new UserController(
	createUserUseCase,
	listUsersUseCase,
	getUserByIdUseCase,
	deleteUserByIdUseCase,
);

const userResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	createdAt: z.string(),
});

const errorResponseSchema = z.object({
	error: z.string(),
	code: z.string().optional(),
});

export const userRoutes = new Elysia({ prefix: '/users' })
	.get(
		'/',
		async ({ set }) => {
			const result = await userController.listUsers();
			set.status = result.status;
			return result.body;
		},
		{
			response: {
				200: z.array(userResponseSchema),
			},
		},
	)
	.get(
		'/:id',
		async ({ set, params }) => {
			const result = await userController.getUserById(params.id);
			set.status = result.status;
			return result.body;
		},
		{
			params: z.object({
				id: z.uuid(),
			}),
			response: {
				200: userResponseSchema,
				404: errorResponseSchema,
			},
		},
	)
	.post(
		'/',
		async ({ set, body }) => {
			const result = await userController.createUser(body);
			set.status = result.status;
			return result.body;
		},
		{
			body: z.object({
				name: z.string().trim().min(3),
				email: z.email().trim().toLowerCase(),
			}),
			response: {
				201: userResponseSchema,
				409: errorResponseSchema,
			},
		},
	)
	.delete(
		'/:id',
		async ({ set, params }) => {
			const result = await userController.deleteUserById(params.id);
			set.status = result.status;
			if (result.status === 204) {
				return;
			}
			return result.body;
		},
		{
			params: z.object({
				id: z.uuid(),
			}),
			response: {
				404: errorResponseSchema,
			},
		},
	);
