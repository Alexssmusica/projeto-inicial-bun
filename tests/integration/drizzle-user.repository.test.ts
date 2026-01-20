import { User } from '@/domain/entities/user.entity';
import { DrizzleUserRepository } from '@/infrastructure/database/adapters/drizzle-user.repository';
import { client } from '@/infrastructure/database/drizzle/client';
import { users } from '@/infrastructure/database/drizzle/schema';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';

describe('DrizzleUserRepository Integration', () => {
	let repository: DrizzleUserRepository;

	beforeEach(async () => {
		repository = new DrizzleUserRepository();
		await client.delete(users);
	});

	afterEach(async () => {
		await client.delete(users);
	});

	describe('create', () => {
		it('should create a user in the database', async () => {
			const user = User.create('John Doe', 'john@example.com');
			const createdUser = await repository.create(user);
			expect(createdUser).toBeInstanceOf(User);
			expect(createdUser.id).toBe(user.id);
			expect(createdUser.name).toBe('John Doe');
			expect(createdUser.email).toBe('john@example.com');
			const [dbUser] = await client.select().from(users).where(eq(users.id, user.id));
			expect(dbUser).toBeDefined();
			expect(dbUser.name).toBe('John Doe');
			expect(dbUser.email).toBe('john@example.com');
		});
	});

	describe('findById', () => {
		it('should find user by id', async () => {
			const user = User.create('John Doe', 'john@example.com');
			await repository.create(user);
			const foundUser = await repository.findById(user.id);
			expect(foundUser).toBeDefined();
			expect(foundUser?.id).toBe(user.id);
			expect(foundUser?.name).toBe('John Doe');
			expect(foundUser?.email).toBe('john@example.com');
		});

		it('should return null when user not found', async () => {
			const nonExistentId = '00000000-0000-0000-0000-000000000000';
			const foundUser = await repository.findById(nonExistentId);
			expect(foundUser).toBeNull();
		});
	});

	describe('findByEmail', () => {
		it('should find user by email', async () => {
			const user = User.create('John Doe', 'john@example.com');
			await repository.create(user);
			const foundUser = await repository.findByEmail('john@example.com');
			expect(foundUser).toBeDefined();
			expect(foundUser?.id).toBe(user.id);
			expect(foundUser?.email).toBe('john@example.com');
		});

		it('should return null when email not found', async () => {
			const foundUser = await repository.findByEmail('nonexistent@example.com');
			expect(foundUser).toBeNull();
		});
	});

	describe('findAll', () => {
		it('should return empty array when no users exist', async () => {
			const allUsers = await repository.findAll();
			expect(allUsers).toEqual([]);
		});

		it('should return all users', async () => {
			const user1 = User.create('User 1', 'user1@example.com');
			const user2 = User.create('User 2', 'user2@example.com');
			const user3 = User.create('User 3', 'user3@example.com');
			await repository.create(user1);
			await repository.create(user2);
			await repository.create(user3);
			const allUsers = await repository.findAll();
			expect(allUsers).toHaveLength(3);
			expect(allUsers.map((u) => u.id)).toContain(user1.id);
			expect(allUsers.map((u) => u.id)).toContain(user2.id);
			expect(allUsers.map((u) => u.id)).toContain(user3.id);
		});
	});

	describe('delete', () => {
		it('should delete user from database', async () => {
			const user = User.create('John Doe', 'john@example.com');
			await repository.create(user);
			await repository.delete(user.id);
			const foundUser = await repository.findById(user.id);
			expect(foundUser).toBeNull();
			const [dbUser] = await client.select().from(users).where(eq(users.id, user.id));
			expect(dbUser).toBeUndefined();
		});

		it('should not throw error when deleting non-existent user', async () => {
			const nonExistentId = '00000000-0000-0000-0000-000000000000';
			await repository.delete(nonExistentId);
			const allUsers = await repository.findAll();
			expect(allUsers).toEqual([]);
		});
	});
});
