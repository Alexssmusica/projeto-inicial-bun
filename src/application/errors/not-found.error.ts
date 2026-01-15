import { BaseApplicationError } from './base-application.error';

export class NotFoundError extends BaseApplicationError {
	constructor(message: string = 'Resource not found') {
		super(message, 'NOT_FOUND', 404);
	}
}
