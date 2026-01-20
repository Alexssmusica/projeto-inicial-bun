import type { UserResponseDto } from '@/application/dtos/user-response.dto';
import type { IUserRepository } from '@/domain/ports/user.repository.port';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';

export class ListUsersUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(): Promise<UserResponseDto[]> {
		const users = await this.userRepository.findAll();
		return users.map((user) => UserMapper.toResponseDto(user));
	}
}
