import { drizzle } from 'drizzle-orm/bun-sql';
import { schema } from '../schema';

export const client = drizzle(Bun.env.DATABASE_URL!, { schema });
