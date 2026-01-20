import { drizzle } from 'drizzle-orm/bun-sql';
import { getDatabaseUrl, IS_TEST } from '../../setup/db.util';
import { schema } from '../schema';

export const client = drizzle(getDatabaseUrl(), { 
	schema, 
	logger: !IS_TEST
});
