import type { CreateUserDto } from '@/application/dtos/create-user.dto';
import type { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import type { DeleteUserByIdUseCase } from '@/application/use-cases/delete-user-by-id.use-case';
import type { GetUserByIdUseCase } from '@/application/use-cases/get-user-by-id.use-case';
import type { ListUsersUseCase } from '@/application/use-cases/list-users.use-case';

export class UserController {
	constructor(
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly listUsersUseCase: ListUsersUseCase,
		private readonly getUserByIdUseCase: GetUserByIdUseCase,
		private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
	) {}

	async createUser(body: CreateUserDto) {
		const result = await this.createUserUseCase.execute(body);
		return {
			status: 201,
			body: result,
		};
	}

	async listUsers() {
		const result = await this.listUsersUseCase.execute();
		return {
			status: 200,
			body: result,
		};
	}

	async getUserById(id: string) {
		const result = await this.getUserByIdUseCase.execute(id);
		return {
			status: 200,
			body: result,
		};
	}

	async deleteUserById(id: string) {
		await this.deleteUserByIdUseCase.execute(id);
		return {
			status: 204,
			body: undefined,
		};
	}
}
