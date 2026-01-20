import type { UserResponseDto } from '@/application/dtos/user-response.dto';
import { formatDate } from '@/application/utils/date-formatter';
import { User } from '@/domain/entities/user.entity';
import type { users } from '../drizzle/schema';

export class UserMapper {
	static toDomainEntity(user: typeof users.$inferSelect): User {
		return new User(user.id, user.name, user.email, user.createdAt);
	}

	static toResponseDto(user: User): UserResponseDto {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: formatDate(user.createdAt),
		};
	}
}
