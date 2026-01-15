import { beforeEach, describe, expect, it } from 'bun:test';
import { NotFoundError } from '@/application/errors/not-found.error';
import { DeleteUserByIdUseCase } from '@/application/use-cases/delete-user-by-id.use-case';
import { MockUserRepository } from '../helpers/mock-user-repository';
import { createMockUser } from '../helpers/test-utils';

describe('DeleteUserByIdUseCase', () => {
	let useCase: DeleteUserByIdUseCase;
	let mockRepository: MockUserRepository;

	beforeEach(() => {
		mockRepository = new MockUserRepository();
		useCase = new DeleteUserByIdUseCase(mockRepository);
	});

	it('should delete user successfully', async () => {
		const user = createMockUser();
		await mockRepository.create(user);
		await useCase.execute(user.id);
		const deletedUser = await mockRepository.findById(user.id);
		expect(deletedUser).toBeNull();
	});

	it('should throw NotFoundError when user does not exist', async () => {
		const nonExistentId = 'non-existent-id';
		expect(useCase.execute(nonExistentId)).rejects.toThrow(NotFoundError);
		expect(useCase.execute(nonExistentId)).rejects.toThrow('User not found');
	});

	it('should not delete other users', async () => {
		const user1 = createMockUser({ name: 'User 1', email: 'user1@example.com' });
		const user2 = createMockUser({ name: 'User 2', email: 'user2@example.com' });
		await mockRepository.create(user1);
		await mockRepository.create(user2);
		await useCase.execute(user1.id);
		const deletedUser = await mockRepository.findById(user1.id);
		const remainingUser = await mockRepository.findById(user2.id);
		expect(deletedUser).toBeNull();
		expect(remainingUser).toBeDefined();
		expect(remainingUser?.id).toBe(user2.id);
	});
});
