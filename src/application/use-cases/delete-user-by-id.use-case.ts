import type { IUserRepository } from '@/domain/ports/user.repository.port';
import { NotFoundError } from '@/application/errors/not-found.error';

export class DeleteUserByIdUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(id: string): Promise<void> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundError('User not found');
		}
		await this.userRepository.delete(id);
	}
}
