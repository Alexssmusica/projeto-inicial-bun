import { BaseApplicationError } from '@/application/errors/base-application.error';
import type { ValidationError } from '@/application/errors/validation.error';

type UnknownRecord = Record<string, unknown>;

function parseErrorIfString(error: unknown): unknown {
	if (typeof error !== 'string') return error;
	try {
		return JSON.parse(error);
	} catch {
		return error;
	}
}

function normalizeError(error: unknown): unknown {
	if (error instanceof Error) {
		return parseErrorIfString(error.message);
	}
	return parseErrorIfString(error);
}

function isObject(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null;
}

function isElysiaValidationError(error: unknown): boolean {
	const parsed = parseErrorIfString(error);
	if (!isObject(parsed)) return false;
	return parsed.code === 'VALIDATION' || parsed.type === 'validation';
}

function extractValidationFields(error: unknown): Record<string, string[]> {
	const fields: Record<string, string[]> = {};
	if (!isObject(error)) return fields;
	if (Array.isArray(error.errors)) {
		for (const item of error.errors) {
			if (!isObject(item) || !Array.isArray(item.path)) continue;
			const path = item.path
				.filter((p): p is string => typeof p === 'string' && Boolean(p))
				.join('.');
			if (!path) continue;
			const message = typeof item.message === 'string' ? item.message : 'Validation failed';
			fields[path] ??= [];
			if (!fields[path].includes(message)) {
				fields[path].push(message);
			}
		}
	}
	if (Object.keys(fields).length === 0 && typeof error.property === 'string') {
		const property = error.property.replace(/^\//, '').replace(/\//g, '.');
		if (property) {
			fields[property] = [
				typeof error.message === 'string' ? error.message : 'Validation failed',
			];
		}
	}
	return fields;
}

export function handleError(context: {
	error: unknown;
	set: { status?: number | string };
	code?: number | string;
	[key: string]: unknown;
}) {
	const { error, set, code } = context;
	const normalizedError = normalizeError(error);
	if (code === 400 && isObject(normalizedError)) {
		const fields = extractValidationFields(normalizedError);
		set.status = 400;
		return {
			error: normalizedError,
			code: 'VALIDATION_ERROR',
			fields: Object.keys(fields).length ? fields : undefined,
		};
	}
	if (isElysiaValidationError(normalizedError)) {
		const fields = extractValidationFields(normalizedError);

		set.status = 400;
		return {
			error: normalizedError,
			code: 'VALIDATION_ERROR',
			fields: Object.keys(fields).length ? fields : undefined,
		};
	}
	if (error instanceof BaseApplicationError) {
		set.status = error.statusCode;
		return {
			error: {
				message: error.message,
				code: error.code,
				fields:
					error.constructor.name === 'ValidationError'
						? (error as ValidationError).fields
						: undefined,
			},
			code: error.code,
		};
	}
	if (error instanceof Error) {
		set.status = 500;
		return {
			error: {
				message: error.message || 'Internal server error',
			},
			code: 'INTERNAL_SERVER_ERROR',
		};
	}
	set.status = 500;
	return {
		error: {
			message: 'Internal server error',
		},
		code: 'INTERNAL_SERVER_ERROR',
	};
}
