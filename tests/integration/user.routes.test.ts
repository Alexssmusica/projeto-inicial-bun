import { client } from '@/infrastructure/database/drizzle/client';
import { users } from '@/infrastructure/database/drizzle/schema';
import { handleError } from '@/presentation/http/middlewares/error-handler.middleware';
import { userRoutes } from '@/presentation/http/routes/user.routes';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';

describe('User Routes Integration', () => {
	let app: ReturnType<typeof createApp>;

	function createApp() {
		return new Elysia().onError(handleError).use(userRoutes);
	}

	beforeEach(async () => {
		await client.delete(users);
		app = createApp();
	});

	afterEach(async () => {
		await client.delete(users);
	});

	describe('POST /users', () => {
		it('should create a user successfully', async () => {
			const response = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
					}),
				}),
			);
			expect(response.status).toBe(201);
			const data = await response.json();
			expect(data.id).toBeDefined();
			expect(data.name).toBe('John Doe');
			expect(data.email).toBe('john@example.com');
			expect(data.createdAt).toBeDefined();
		});

		it('should return 400 for invalid input', async () => {
			const response = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'Jo',
						email: 'invalid-email',
					}),
				}),
			);
			expect(response.status).toBe(400);
		});

		it('should return 409 for duplicate email', async () => {
			await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
					}),
				}),
			);
			const response = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'Jane Doe',
						email: 'john@example.com',
					}),
				}),
			);
			expect(response.status).toBe(409);
		});
	});

	describe('GET /users', () => {
		it('should return empty array when no users exist', async () => {
			const response = await app.handle(new Request('http://localhost/users'));
			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data).toEqual([]);
		});

		it('should return all users', async () => {
			await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'User 1',
						email: 'user1@example.com',
					}),
				}),
			);
			await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'User 2',
						email: 'user2@example.com',
					}),
				}),
			);
			const response = await app.handle(new Request('http://localhost/users'));
			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data).toHaveLength(2);
		});
	});

	describe('GET /users/:id', () => {
		it('should return user when found', async () => {
			const createResponse = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
					}),
				}),
			);
			const createdUser = await createResponse.json();
			const response = await app.handle(
				new Request(`http://localhost/users/${createdUser.id}`),
			);
			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.id).toBe(createdUser.id);
			expect(data.name).toBe('John Doe');
			expect(data.email).toBe('john@example.com');
		});

		it('should return 404 when user not found', async () => {
			const fakeId = '00000000-0000-0000-0000-000000000000';
			const response = await app.handle(new Request(`http://localhost/users/${fakeId}`));

			expect(response.status).toBe(404);
		});

		it('should return 400 for invalid UUID', async () => {
			const response = await app.handle(new Request('http://localhost/users/invalid-id'));
			expect(response.status).toBe(400);
		});
	});

	describe('PUT /users/:id', () => {
		it('should update user name successfully', async () => {
			const createResponse = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
					}),
				}),
			);
			const createdUser = await createResponse.json();
			const response = await app.handle(
				new Request(`http://localhost/users/${createdUser.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'Jane Doe',
					}),
				}),
			);
			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.id).toBe(createdUser.id);
			expect(data.name).toBe('Jane Doe');
			expect(data.email).toBe('john@example.com');
		});

		it('should update user email successfully', async () => {
			const createResponse = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
					}),
				}),
			);
			const createdUser = await createResponse.json();
			const response = await app.handle(
				new Request(`http://localhost/users/${createdUser.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: 'jane@example.com',
					}),
				}),
			);
			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.id).toBe(createdUser.id);
			expect(data.name).toBe('John Doe');
			expect(data.email).toBe('jane@example.com');
		});

		it('should update both name and email successfully', async () => {
			const createResponse = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
					}),
				}),
			);
			const createdUser = await createResponse.json();
			const response = await app.handle(
				new Request(`http://localhost/users/${createdUser.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'Jane Doe',
						email: 'jane@example.com',
					}),
				}),
			);
			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.id).toBe(createdUser.id);
			expect(data.name).toBe('Jane Doe');
			expect(data.email).toBe('jane@example.com');
		});

		it('should return 404 when user not found', async () => {
			const fakeId = '00000000-0000-0000-0000-000000000000';
			const response = await app.handle(
				new Request(`http://localhost/users/${fakeId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'Updated Name',
					}),
				}),
			);
			expect(response.status).toBe(404);
		});

		it('should return 409 for duplicate email', async () => {
			await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'User 1',
						email: 'user1@example.com',
					}),
				}),
			);
			const createResponse = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'User 2',
						email: 'user2@example.com',
					}),
				}),
			);
			const createdUser = await createResponse.json();
			const response = await app.handle(
				new Request(`http://localhost/users/${createdUser.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: 'user1@example.com',
					}),
				}),
			);
			expect(response.status).toBe(409);
		});

		it('should return 400 for invalid input', async () => {
			const createResponse = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
					}),
				}),
			);
			const createdUser = await createResponse.json();
			const response = await app.handle(
				new Request(`http://localhost/users/${createdUser.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'Jo',
						email: 'invalid-email',
					}),
				}),
			);
			expect(response.status).toBe(400);
		});

		it('should return 400 for invalid UUID', async () => {
			const response = await app.handle(
				new Request('http://localhost/users/invalid-id', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'Updated Name',
					}),
				}),
			);
			expect(response.status).toBe(400);
		});
	});

	describe('DELETE /users/:id', () => {
		it('should delete user successfully', async () => {
			const createResponse = await app.handle(
				new Request('http://localhost/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
					}),
				}),
			);
			const createdUser = await createResponse.json();
			const response = await app.handle(
				new Request(`http://localhost/users/${createdUser.id}`, {
					method: 'DELETE',
				}),
			);
			expect(response.status).toBe(204);
			const getResponse = await app.handle(
				new Request(`http://localhost/users/${createdUser.id}`),
			);
			expect(getResponse.status).toBe(404);
		});

		it('should return 404 when user not found', async () => {
			const fakeId = '00000000-0000-0000-0000-000000000000';
			const response = await app.handle(
				new Request(`http://localhost/users/${fakeId}`, {
					method: 'DELETE',
				}),
			);
			expect(response.status).toBe(404);
		});
	});
});
