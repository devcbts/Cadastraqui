import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { PrismaClient as backupPrisma } from '../../backup_prisma/generated/clientBackup'
// Caso esteja em ambiente de desenvolvimento as "querys" do banco de dados
// serão informadas no log da aplicação para efeitos de melhor debug do código
// Prisma v7: use adapter OR accelerateUrl. Here we use direct adapter.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)


const pollHistoryDatabase = new pg.Pool({ connectionString: process.env.HISTORY_DATABASE_URL })
const adapterHistory = new PrismaPg(pollHistoryDatabase)
export const prisma = new PrismaClient({
  adapter: adapter
  // log: process.env.NODE_ENV === 'dev' ? ['query'] : [],
})
export const historyDatabase = new backupPrisma({
  adapter : adapterHistory,
  // log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
