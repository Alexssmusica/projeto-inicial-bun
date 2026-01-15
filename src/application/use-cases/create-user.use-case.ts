import { User } from '@/domain/entities/user.entity';
import type { IUserRepository } from '@/domain/ports/user.repository.port';
import type { CreateUserDto } from '@/application/dtos/create-user.dto';
import type { UserResponseDto } from '@/application/dtos/user-response.dto';
import { ConflictError } from '@/application/errors/conflict.error';

export class CreateUserUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(input: CreateUserDto): Promise<UserResponseDto> {
		const existingUser = await this.userRepository.findByEmail(input.email);
		if (existingUser) {
			throw new ConflictError('Email already exists');
		}
		const user = User.create(input.name, input.email);
		const savedUser = await this.userRepository.create(user);
		return {
			id: savedUser.id,
			name: savedUser.name,
			email: savedUser.email,
			createdAt: savedUser.createdAt.toISOString(),
		};
	}
}
