import z from 'zod';

export const errorResponseSchema = z.object({
	error: z.object({
		message: z.string(),
		code: z.string().optional(),
	}),
});

export const validationErrorResponseSchema = z.object({
	error: z.object({
		message: z.string(),
		code: z.string().optional(),
		fields: z.record(z.string(), z.string()),
	}),
});
