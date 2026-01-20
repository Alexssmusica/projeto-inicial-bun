import { beforeEach, describe, expect, it } from 'bun:test';
import { ConflictError } from '@/application/errors/conflict.error';
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { MockUserRepository } from '../helpers/mock-user-repository';
import { createMockUser } from '../helpers/test-utils';

describe('CreateUserUseCase', () => {
	let useCase: CreateUserUseCase;
	let mockRepository: MockUserRepository;

	beforeEach(() => {
		mockRepository = new MockUserRepository();
		useCase = new CreateUserUseCase(mockRepository);
	});

	it('should create a user successfully', async () => {
		const input = {
			name: 'John Doe',
			email: 'john@example.com',
		};
		const result = await useCase.execute(input);
		expect(result).toBeDefined();
		expect(result.id).toBeDefined();
		expect(result.name).toBe('John Doe');
		expect(result.email).toBe('john@example.com');
		expect(result.createdAt).toBeDefined();
		expect(typeof result.createdAt).toBe('string');
	});

	it('should throw ConflictError when email already exists', async () => {
		const existingUser = createMockUser({
			name: 'Existing User',
			email: 'existing@example.com',
		});
		await mockRepository.create(existingUser);
		const input = {
			name: 'New User',
			email: 'existing@example.com',
		};
		expect(useCase.execute(input)).rejects.toThrow(ConflictError);
		expect(useCase.execute(input)).rejects.toThrow('Email already exists');
	});

	it('should save user to repository', async () => {
		const input = {
			name: 'John Doe',
			email: 'john@example.com',
		};
		const result = await useCase.execute(input);
		const savedUser = await mockRepository.findById(result.id);
		expect(savedUser).toBeDefined();
		expect(savedUser?.name).toBe('John Doe');
		expect(savedUser?.email).toBe('john@example.com');
	});

	it('should return createdAt in ISO format with timezone', async () => {
		const input = {
			name: 'John Doe',
			email: 'john@example.com',
		};
		const result = await useCase.execute(input);
		expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
	});
});
