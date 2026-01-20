import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { DeleteUserByIdUseCase } from '@/application/use-cases/delete-user-by-id.use-case';
import { GetUserByIdUseCase } from '@/application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '@/application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
import { UserController } from '@/presentation/http/controllers/user.controller';
import { beforeEach, describe, expect, it } from 'bun:test';
import { MockUserRepository } from '../helpers/mock-user-repository';
import { createMockUser } from '../helpers/test-utils';

describe('UserController Integration', () => {
	let controller: UserController;
	let mockRepository: MockUserRepository;

	beforeEach(() => {
		mockRepository = new MockUserRepository();
		const createUserUseCase = new CreateUserUseCase(mockRepository);
		const listUsersUseCase = new ListUsersUseCase(mockRepository);
		const getUserByIdUseCase = new GetUserByIdUseCase(mockRepository);
		const updateUserUseCase = new UpdateUserUseCase(mockRepository);
		const deleteUserByIdUseCase = new DeleteUserByIdUseCase(mockRepository);

		controller = new UserController(
			createUserUseCase,
			listUsersUseCase,
			getUserByIdUseCase,
			updateUserUseCase,
			deleteUserByIdUseCase,
		);
	});

	describe('createUser', () => {
		it('should create user and return 201 status', async () => {
			const body = {
				name: 'John Doe',
				email: 'john@example.com',
			};
			const result = await controller.createUser(body);
			expect(result.status).toBe(201);
			expect(result.body).toBeDefined();
			expect(result.body.id).toBeDefined();
			expect(result.body.name).toBe('John Doe');
			expect(result.body.email).toBe('john@example.com');
		});
	});

	describe('listUsers', () => {
		it('should return empty array when no users exist', async () => {
			const result = await controller.listUsers();
			expect(result.status).toBe(200);
			expect(result.body).toEqual([]);
		});

		it('should return all users', async () => {
			const user1 = createMockUser({ name: 'User 1', email: 'user1@example.com' });
			const user2 = createMockUser({ name: 'User 2', email: 'user2@example.com' });
			await mockRepository.create(user1);
			await mockRepository.create(user2);
			const result = await controller.listUsers();
			expect(result.status).toBe(200);
			expect(result.body).toHaveLength(2);
		});
	});

	describe('getUserById', () => {
		it('should return user when found', async () => {
			const user = createMockUser({ name: 'John Doe', email: 'john@example.com' });
			await mockRepository.create(user);
			const result = await controller.getUserById(user.id);
			expect(result.status).toBe(200);
			expect(result.body).toBeDefined();
			expect(result.body.id).toBe(user.id);
			expect(result.body.name).toBe('John Doe');
		});
		it('should throw error when user not found', async () => {
			expect(controller.getUserById('non-existent-id')).rejects.toThrow();
		});
	});

	describe('deleteUserById', () => {
		it('should delete user and return 204 status', async () => {
			const user = createMockUser();
			await mockRepository.create(user);

			const result = await controller.deleteUserById(user.id);

			expect(result.status).toBe(204);
			expect(result.body).toBeUndefined();

			const deletedUser = await mockRepository.findById(user.id);
			expect(deletedUser).toBeNull();
		});

		it('should throw error when user not found', async () => {
			await expect(controller.deleteUserById('non-existent-id')).rejects.toThrow();
		});
	});
});
