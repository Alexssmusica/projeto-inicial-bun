import { describe, expect, it } from 'bun:test';
import { BadRequestError } from '@/application/errors/bad-request.error';
import { BaseApplicationError } from '@/application/errors/base-application.error';
import { ConflictError } from '@/application/errors/conflict.error';
import { NotFoundError } from '@/application/errors/not-found.error';
import { ValidationError } from '@/application/errors/validation.error';

describe('Application Errors', () => {
	describe('BaseApplicationError', () => {
		it('should create error with message, code and statusCode', () => {
			class TestError extends BaseApplicationError {
				constructor(message: string) {
					super(message, 'TEST_ERROR', 400);
				}
			}
			const error = new TestError('Test message');
			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(BaseApplicationError);
			expect(error.message).toBe('Test message');
			expect(error.code).toBe('TEST_ERROR');
			expect(error.statusCode).toBe(400);
			expect(error.name).toBe('TestError');
		});
	});

	describe('NotFoundError', () => {
		it('should create error with default message', () => {
			const error = new NotFoundError();
			expect(error).toBeInstanceOf(NotFoundError);
			expect(error.message).toBe('Resource not found');
			expect(error.code).toBe('NOT_FOUND');
			expect(error.statusCode).toBe(404);
		});

		it('should create error with custom message', () => {
			const error = new NotFoundError('User not found');
			expect(error.message).toBe('User not found');
			expect(error.code).toBe('NOT_FOUND');
			expect(error.statusCode).toBe(404);
		});
	});

	describe('ConflictError', () => {
		it('should create error with default message', () => {
			const error = new ConflictError();
			expect(error).toBeInstanceOf(ConflictError);
			expect(error.message).toBe('Resource conflict');
			expect(error.code).toBe('CONFLICT');
			expect(error.statusCode).toBe(409);
		});

		it('should create error with custom message', () => {
			const error = new ConflictError('Email already exists');
			expect(error.message).toBe('Email already exists');
			expect(error.code).toBe('CONFLICT');
			expect(error.statusCode).toBe(409);
		});
	});

	describe('BadRequestError', () => {
		it('should create error with default message', () => {
			const error = new BadRequestError();
			expect(error).toBeInstanceOf(BadRequestError);
			expect(error.message).toBe('Bad request');
			expect(error.code).toBe('BAD_REQUEST');
			expect(error.statusCode).toBe(400);
		});

		it('should create error with custom message', () => {
			const error = new BadRequestError('Invalid input');
			expect(error.message).toBe('Invalid input');
			expect(error.code).toBe('BAD_REQUEST');
			expect(error.statusCode).toBe(400);
		});
	});

	describe('ValidationError', () => {
		it('should create error with default message', () => {
			const error = new ValidationError();
			expect(error).toBeInstanceOf(ValidationError);
			expect(error.message).toBe('Validation failed');
			expect(error.code).toBe('VALIDATION_ERROR');
			expect(error.statusCode).toBe(400);
			expect(error.fields).toBeUndefined();
		});

		it('should create error with custom message and fields', () => {
			const fields = {
				email: ['Email is required', 'Email must be valid'],
				name: ['Name is required'],
			};
			const error = new ValidationError('Validation failed', fields);
			expect(error.message).toBe('Validation failed');
			expect(error.code).toBe('VALIDATION_ERROR');
			expect(error.statusCode).toBe(400);
			expect(error.fields).toEqual(fields);
		});
	});
});
