import { BaseApplicationError } from './base-application.error';

export class BadRequestError extends BaseApplicationError {
	constructor(message: string = 'Bad request') {
		super(message, 'BAD_REQUEST', 400);
	}
}
