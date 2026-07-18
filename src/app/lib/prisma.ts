import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client.js';
import dotEnv from '../config/dotEnv';

const adapter = new PrismaPg({
  connectionString: dotEnv.database_url,
});

const prisma = new PrismaClient({ adapter });

export default prisma