import { describe, expect, it } from 'bun:test';
import { User } from '@/domain/entities/user.entity';

describe('User Entity', () => {
	it('should create a user with valid data', () => {
		const user = User.create('John Doe', 'john@example.com');
		expect(user).toBeInstanceOf(User);
		expect(user.name).toBe('John Doe');
		expect(user.email).toBe('john@example.com');
		expect(user.id).toBeDefined();
		expect(user.createdAt).toBeInstanceOf(Date);
	});

	it('should trim name and email', () => {
		const user = User.create('  John Doe  ', '  JOHN@EXAMPLE.COM  ');
		expect(user.name).toBe('John Doe');
		expect(user.email).toBe('john@example.com');
	});

	it('should convert email to lowercase', () => {
		const user = User.create('John Doe', 'JOHN@EXAMPLE.COM');
		expect(user.email).toBe('john@example.com');
	});

	it('should generate unique IDs', () => {
		const user1 = User.create('User 1', 'user1@example.com');
		const user2 = User.create('User 2', 'user2@example.com');
		expect(user1.id).not.toBe(user2.id);
	});

	it('should create user with current date', () => {
		const before = new Date();
		const user = User.create('John Doe', 'john@example.com');
		const after = new Date();
		expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
		expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
	});
});
