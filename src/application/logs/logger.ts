import moment from 'moment';
import winston from 'winston';

export const logger: winston.Logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.errors({ stack: true }),
		winston.format.simple(),
		winston.format.timestamp(),
		winston.format.splat(),
		winston.format.printf((data) => {
			const timestamp = `${moment(data.timestamp as string)
				.utcOffset('-03:00')
				.format('YYYY-MM-DD HH:mm:ss:SSS')}`;
			return `${data.level}: [${timestamp}] ${data.message}`;
		}),
	),
	transports: [
		new winston.transports.File({
			maxFiles: 5,
			maxsize: 5120000,
			filename: 'logs/api.log',
		}),
		new winston.transports.Console({
			level: 'info',
		}),
	],
});
