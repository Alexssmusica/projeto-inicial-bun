import { BaseApplicationError } from '@/application/errors/base-application.error';
import { ValidationError as ElysiaValidationError } from 'elysia';
import z, { ZodError } from 'zod';

function convertElysiaValidationErrors(
	errors: Array<{ path: string; message: string; summary?: string }>,
): Record<string, string> {
	const fields: Record<string, string[]> = {};
	for (const item of errors) {
		const path = item.path.replace(/^\//, '').replace(/\//g, '.');
		if (!path) continue;
		const message = item.summary || item.message || 'Validation failed';
		fields[path] ??= [];
		if (!fields[path].includes(message)) {
			fields[path].push(message);
		}
	}
	return Object.fromEntries(
		Object.entries(fields).map(([key, value]) => [key, value.join(', ')]),
	);
}

export function handleError(context: {
	error: unknown;
	set: { status?: number | string };
	code?: number | string;
	[key: string]: unknown;
}) {
	const { error, set, code } = context;
	if (code === 'VALIDATION' && error instanceof ElysiaValidationError) {
		set.status = 400;
		const fields = convertElysiaValidationErrors(
			error.all.map((error) => ({
				path: error.path,
				message: error.message,
				summary: error.summary,
			})),
		);
		return {
			error: { message: 'Validation failed', code: 'VALIDATION_ERROR', fields: fields },
		};
	}
	if (error instanceof ZodError) {
		set.status = 400;
		return {
			error: {
				message: 'Validation failed',
				code: 'VALIDATION_ERROR',
				fields: z.treeifyError(error),
			},
		};
	}
	if (error instanceof BaseApplicationError) {
		set.status = error.statusCode;
		return {
			error: {
				message: error.message,
				code: error.code,
			},
		};
	}
	set.status = 500;
	return {
		error: {
			message: 'Internal server error',
			code: 'INTERNAL_SERVER_ERROR',
		},
	};
}
