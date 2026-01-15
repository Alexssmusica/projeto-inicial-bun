import type { IUserRepository } from '@/domain/ports/user.repository.port';
import type { UserResponseDto } from '@/application/dtos/user-response.dto';
import { NotFoundError } from '@/application/errors/not-found.error';

export class GetUserByIdUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(id: string): Promise<UserResponseDto> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundError('User not found');
		}
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt.toISOString(),
		};
	}
}
