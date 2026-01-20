import { eq } from 'drizzle-orm';
import { User } from '@/domain/entities/user.entity';
import type { IUserRepository } from '@/domain/ports/user.repository.port';
import { client } from '@/infrastructure/database/drizzle/client';
import { users } from '@/infrastructure/database/drizzle/schema';

export class DrizzleUserRepository implements IUserRepository {
	async create(user: User): Promise<User> {
		const [createdUser] = await client.transaction(async (client) => {
			return client.insert(users).values({
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
			}).returning();
		});
		return this.toDomainEntity(createdUser);
	}

	async findById(id: string): Promise<User | null> {
		const foundUser = await client.query.users.findFirst({
			where: eq(users.id, id),
		});
		if (!foundUser) {
			return null;
		}
		return this.toDomainEntity(foundUser);
	}

	async findByEmail(email: string): Promise<User | null> {
		const foundUser = await client.query.users.findFirst({
			where: eq(users.email, email),
		});
		if (!foundUser) {
			return null;
		}
		return this.toDomainEntity(foundUser);
	}

	async findAll(): Promise<User[]> {
		const allUsers = await client.query.users.findMany();
		return allUsers.map((user) => this.toDomainEntity(user));
	}

	async delete(id: string): Promise<void> {
		await client.delete(users).where(eq(users.id, id));
	}

	private toDomainEntity(dbUser: typeof users.$inferSelect): User {
		return new User(dbUser.id, dbUser.name, dbUser.email, dbUser.createdAt);
	}
}
