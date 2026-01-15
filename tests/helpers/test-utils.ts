import { User } from '@/domain/entities/user.entity';

export function createMockUser(overrides?: Partial<User>): User {
	const defaultUser = User.create('John Doe', 'john@example.com');
	if (overrides) {
		return new User(
			overrides.id ?? defaultUser.id,
			overrides.name ?? defaultUser.name,
			overrides.email ?? defaultUser.email,
			overrides.createdAt ?? defaultUser.createdAt,
		);
	}
	return defaultUser;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
