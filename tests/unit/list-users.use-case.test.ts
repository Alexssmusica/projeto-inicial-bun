import { beforeEach, describe, expect, it } from 'bun:test';
import { ListUsersUseCase } from '@/application/use-cases/list-users.use-case';
import { MockUserRepository } from '../helpers/mock-user-repository';
import { createMockUser } from '../helpers/test-utils';

describe('ListUsersUseCase', () => {
	let useCase: ListUsersUseCase;
	let mockRepository: MockUserRepository;

	beforeEach(() => {
		mockRepository = new MockUserRepository();
		useCase = new ListUsersUseCase(mockRepository);
	});

	it('should return empty array when no users exist', async () => {
		const result = await useCase.execute();
		expect(result).toEqual([]);
	});

	it('should return all users', async () => {
		const user1 = createMockUser({ name: 'User 1', email: 'user1@example.com' });
		const user2 = createMockUser({ name: 'User 2', email: 'user2@example.com' });
		const user3 = createMockUser({ name: 'User 3', email: 'user3@example.com' });
		await mockRepository.create(user1);
		await mockRepository.create(user2);
		await mockRepository.create(user3);
		const result = await useCase.execute();
		expect(result).toHaveLength(3);
		expect(result.map((u) => u.id)).toContain(user1.id);
		expect(result.map((u) => u.id)).toContain(user2.id);
		expect(result.map((u) => u.id)).toContain(user3.id);
	});

	it('should return users with correct format', async () => {
		const user = createMockUser({ name: 'John Doe', email: 'john@example.com' });
		await mockRepository.create(user);
		const result = await useCase.execute();
		expect(result[0]).toHaveProperty('id');
		expect(result[0]).toHaveProperty('name');
		expect(result[0]).toHaveProperty('email');
		expect(result[0]).toHaveProperty('createdAt');
		expect(result[0].name).toBe('John Doe');
		expect(result[0].email).toBe('john@example.com');
		expect(typeof result[0].createdAt).toBe('string');
	});

	it('should return createdAt in ISO format with timezone', async () => {
		const user = createMockUser();
		await mockRepository.create(user);
		const result = await useCase.execute();
		expect(result[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
	});
});
