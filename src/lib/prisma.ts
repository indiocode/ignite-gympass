import { PrismaClient } from '@prisma/client';

import { Env } from '~/env';

export const prisma = new PrismaClient({
	log: Env.NODE_ENV === 'dev' ? ['query'] : [],
});
