import { BaseApplicationError } from './base-application.error';

export class ValidationError extends BaseApplicationError {
	public readonly fields?: Record<string, string[]>;

	constructor(message: string = 'Validation failed', fields?: Record<string, string[]>) {
		super(message, 'VALIDATION_ERROR', 400);
		this.fields = fields;
	}
}
