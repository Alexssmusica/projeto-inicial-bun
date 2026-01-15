import type { User } from '@/domain/entities/user.entity';

export interface IUserRepository {
	create(user: User): Promise<User>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findAll(): Promise<User[]>;
	delete(id: string): Promise<void>;
}
