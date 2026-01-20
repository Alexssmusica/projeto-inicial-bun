import { randomUUIDv7 } from 'bun';
export class User {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly email: string,
		public readonly createdAt: Date,
	) {}

	static create(name: string, email: string): User {
		return new User(randomUUIDv7(), name.trim(), email.trim().toLowerCase(), new Date());
	}
}
