import { drizzle } from 'drizzle-orm/bun-sql';
import { schema } from '../schema';
import { getDatabaseUrl, IS_TEST } from '../../setup/db.util';

export const client = drizzle(getDatabaseUrl(), { 
	schema, 
	logger: !IS_TEST
});
