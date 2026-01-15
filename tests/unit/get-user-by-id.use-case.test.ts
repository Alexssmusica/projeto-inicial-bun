import { beforeEach, describe, expect, it } from 'bun:test';
import { NotFoundError } from '@/application/errors/not-found.error';
import { GetUserByIdUseCase } from '@/application/use-cases/get-user-by-id.use-case';
import { MockUserRepository } from '../helpers/mock-user-repository';
import { createMockUser } from '../helpers/test-utils';

describe('GetUserByIdUseCase', () => {
	let useCase: GetUserByIdUseCase;
	let mockRepository: MockUserRepository;

	beforeEach(() => {
		mockRepository = new MockUserRepository();
		useCase = new GetUserByIdUseCase(mockRepository);
	});

	it('should return user when found', async () => {
		const user = createMockUser({
			name: 'John Doe',
			email: 'john@example.com',
		});
		await mockRepository.create(user);
		const result = await useCase.execute(user.id);
		expect(result).toBeDefined();
		expect(result.id).toBe(user.id);
		expect(result.name).toBe('John Doe');
		expect(result.email).toBe('john@example.com');
		expect(result.createdAt).toBeDefined();
	});

	it('should throw NotFoundError when user does not exist', async () => {
		const nonExistentId = 'non-existent-id';
		expect(useCase.execute(nonExistentId)).rejects.toThrow(NotFoundError);
		expect(useCase.execute(nonExistentId)).rejects.toThrow('User not found');
	});

	it('should return createdAt as ISO string', async () => {
		const user = createMockUser();
		await mockRepository.create(user);
		const result = await useCase.execute(user.id);
		expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
	});
});
