import { PrismaClient } from '@prisma/client'
import pg from 'pg'
import { PrismaClient as backupPrisma } from '../../backup_prisma/generated/clientBackup'
// Caso esteja em ambiente de desenvolvimento as "querys" do banco de dados
// serão informadas no log da aplicação para efeitos de melhor debug do código
// Prisma v7: use adapter OR accelerateUrl. Here we use direct adapter.


export const prisma = new PrismaClient({
  // log: process.env.NODE_ENV === 'dev' ? ['query'] : [],
})
export const historyDatabase = new backupPrisma({
  // log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
