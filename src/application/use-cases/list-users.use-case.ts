import type { IUserRepository } from '@/domain/ports/user.repository.port';
import type { UserResponseDto } from '@/application/dtos/user-response.dto';

export class ListUsersUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(): Promise<UserResponseDto[]> {
		const users = await this.userRepository.findAll();
		return users.map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt.toISOString(),
		}));
	}
}
