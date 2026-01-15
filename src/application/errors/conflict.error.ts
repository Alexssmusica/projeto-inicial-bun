import { BaseApplicationError } from './base-application.error';

export class ConflictError extends BaseApplicationError {
	constructor(message: string = 'Resource conflict') {
		super(message, 'CONFLICT', 409);
	}
}
