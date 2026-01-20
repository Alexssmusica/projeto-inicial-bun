import type { UserResponseDto } from '@/application/dtos/user-response.dto';
import { NotFoundError } from '@/application/errors/not-found.error';
import type { IUserRepository } from '@/domain/ports/user.repository.port';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';

export class GetUserByIdUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(id: string): Promise<UserResponseDto> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundError('User not found');
		}
		return UserMapper.toResponseDto(user);
	}
}
