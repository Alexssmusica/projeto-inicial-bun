
import { User } from '@/domain/entities/user.entity';
import { users } from '../drizzle/schema';
import { UserResponseDto } from '@/application/dtos/user-response.dto';
import { formatDate } from '@/application/utils/date-formatter';

export class UserMapper {
    static toDomainEntity(user : typeof users.$inferSelect): User {
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
