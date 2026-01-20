import moment from 'moment';

const TIMEZONE = '-03:00';
export function formatDate(date: Date): string {
	return moment(date).utcOffset(TIMEZONE).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
}
