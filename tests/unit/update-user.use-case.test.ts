import { ConflictError } from '@/application/errors/conflict.error';
import { NotFoundError } from '@/application/errors/not-found.error';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
import { beforeEach, describe, expect, it } from 'bun:test';
import { MockUserRepository } from '../helpers/mock-user-repository';
import { createMockUser } from '../helpers/test-utils';

describe('UpdateUserUseCase', () => {
	let useCase: UpdateUserUseCase;
	let mockRepository: MockUserRepository;

	beforeEach(() => {
		mockRepository = new MockUserRepository();
		useCase = new UpdateUserUseCase(mockRepository);
	});

	it('should update user name successfully', async () => {
		const user = createMockUser({
			name: 'John Doe',
			email: 'john@example.com',
		});
		await mockRepository.create(user);

		const result = await useCase.execute(user.id, { name: 'Jane Doe' });

		expect(result.id).toBe(user.id);
		expect(result.name).toBe('Jane Doe');
		expect(result.email).toBe('john@example.com');
		expect(result.createdAt).toBeDefined();
	});

	it('should update user email successfully', async () => {
		const user = createMockUser({
			name: 'John Doe',
			email: 'john@example.com',
		});
		await mockRepository.create(user);

		const result = await useCase.execute(user.id, { email: 'jane@example.com' });

		expect(result.id).toBe(user.id);
		expect(result.name).toBe('John Doe');
		expect(result.email).toBe('jane@example.com');
		expect(result.createdAt).toBeDefined();
	});

	it('should update both name and email successfully', async () => {
		const user = createMockUser({
			name: 'John Doe',
			email: 'john@example.com',
		});
		await mockRepository.create(user);

		const result = await useCase.execute(user.id, {
			name: 'Jane Doe',
			email: 'jane@example.com',
		});

		expect(result.id).toBe(user.id);
		expect(result.name).toBe('Jane Doe');
		expect(result.email).toBe('jane@example.com');
		expect(result.createdAt).toBeDefined();
	});

	it('should throw NotFoundError when user does not exist', async () => {
		const nonExistentId = 'non-existent-id';
		expect(useCase.execute(nonExistentId, { name: 'New Name' })).rejects.toThrow(NotFoundError);
		expect(useCase.execute(nonExistentId, { name: 'New Name' })).rejects.toThrow(
			'User not found',
		);
	});

	it('should throw ConflictError when email already exists', async () => {
		const user1 = createMockUser({
			name: 'User 1',
			email: 'user1@example.com',
		});
		const user2 = createMockUser({
			name: 'User 2',
			email: 'user2@example.com',
		});
		await mockRepository.create(user1);
		await mockRepository.create(user2);

		expect(useCase.execute(user1.id, { email: 'user2@example.com' })).rejects.toThrow(
			ConflictError,
		);
		expect(useCase.execute(user1.id, { email: 'user2@example.com' })).rejects.toThrow(
			'Email already exists',
		);
	});

	it('should not throw ConflictError when updating to same email', async () => {
		const user = createMockUser({
			name: 'John Doe',
			email: 'john@example.com',
		});
		await mockRepository.create(user);

		const result = await useCase.execute(user.id, { email: 'john@example.com' });

		expect(result.email).toBe('john@example.com');
	});

	it('should return createdAt in ISO format with timezone', async () => {
		const user = createMockUser();
		await mockRepository.create(user);
		const result = await useCase.execute(user.id, { name: 'Updated Name' });
		expect(result.createdAt).toMatch(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/,
		);
	});

	it('should update user in repository', async () => {
		const user = createMockUser({
			name: 'John Doe',
			email: 'john@example.com',
		});
		await mockRepository.create(user);

		await useCase.execute(user.id, { name: 'Jane Doe' });

		const updatedUser = await mockRepository.findById(user.id);
		expect(updatedUser).toBeDefined();
		expect(updatedUser?.name).toBe('Jane Doe');
		expect(updatedUser?.email).toBe('john@example.com');
	});
});
