import { eq } from 'drizzle-orm';
import { User } from '@/domain/entities/user.entity';
import type { IUserRepository } from '@/domain/ports/user.repository.port';
import { db } from '@/infrastructure/database/drizzle/db';
import { users } from '@/infrastructure/database/drizzle/schema';

export class DrizzleUserRepository implements IUserRepository {
	async create(user: User): Promise<User> {
		const [createdUser] = await db
			.insert(users)
			.values({
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
			})
			.returning();

		return this.toDomainEntity(createdUser);
	}

	async findById(id: string): Promise<User | null> {
		const [foundUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);

		if (!foundUser) {
			return null;
		}

		return this.toDomainEntity(foundUser);
	}

	async findByEmail(email: string): Promise<User | null> {
		const [foundUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

		if (!foundUser) {
			return null;
		}

		return this.toDomainEntity(foundUser);
	}

	async findAll(): Promise<User[]> {
		const allUsers = await db.select().from(users);
		return allUsers.map((user) => this.toDomainEntity(user));
	}

	async delete(id: string): Promise<void> {
		await db.delete(users).where(eq(users.id, id));
	}

	private toDomainEntity(dbUser: typeof users.$inferSelect): User {
		return new User(dbUser.id, dbUser.name, dbUser.email, dbUser.createdAt);
	}
}
