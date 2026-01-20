import type { UpdateUserDto } from '@/application/dtos/update-user.dto';
import type { User } from '@/domain/entities/user.entity';

export interface IUserRepository {
	create(user: User): Promise<User>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findAll(): Promise<User[]>;
	update(id: string, data: UpdateUserDto): Promise<User>;
	delete(id: string): Promise<void>;
}
