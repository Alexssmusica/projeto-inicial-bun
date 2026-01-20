import type { UpdateUserDto } from '@/application/dtos/update-user.dto';
import { User } from '@/domain/entities/user.entity';
import type { IUserRepository } from '@/domain/ports/user.repository.port';

export class MockUserRepository implements IUserRepository {
	private users: Map<string, User> = new Map();

	async create(user: User): Promise<User> {
		this.users.set(user.id, user);
		return user;
	}

	async findById(id: string): Promise<User | null> {
		return this.users.get(id) || null;
	}

	async findByEmail(email: string): Promise<User | null> {
		for (const user of this.users.values()) {
			if (user.email === email) {
				return user;
			}
		}
		return null;
	}

	async findAll(): Promise<User[]> {
		return Array.from(this.users.values());
	}

	async update(id: string, data: UpdateUserDto): Promise<User> {
		const user = this.users.get(id);
		if (!user) {
			throw new Error('User not found');
		}
		const updatedUser = new User(
			user.id,
			data.name !== undefined ? data.name : user.name,
			data.email !== undefined ? data.email : user.email,
			user.createdAt,
		);
		this.users.set(id, updatedUser);
		return updatedUser;
	}

	async delete(id: string): Promise<void> {
		this.users.delete(id);
	}

	clear(): void {
		this.users.clear();
	}
}
