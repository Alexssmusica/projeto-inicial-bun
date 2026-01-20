import type { UpdateUserDto } from '@/application/dtos/update-user.dto';
import type { UserResponseDto } from '@/application/dtos/user-response.dto';
import { ConflictError } from '@/application/errors/conflict.error';
import { NotFoundError } from '@/application/errors/not-found.error';
import type { IUserRepository } from '@/domain/ports/user.repository.port';

export class UpdateUserUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(id: string, input: UpdateUserDto): Promise<UserResponseDto> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundError('User not found');
		}
		if (input.email && input.email !== user.email) {
			const existingUser = await this.userRepository.findByEmail(input.email);
			if (existingUser) {
				throw new ConflictError('Email already exists');
			}
		}
		const updatedUser = await this.userRepository.update(id, input);
		return {
			id: updatedUser.id,
			name: updatedUser.name,
			email: updatedUser.email,
			createdAt: updatedUser.createdAt.toISOString(),
		};
	}
}
