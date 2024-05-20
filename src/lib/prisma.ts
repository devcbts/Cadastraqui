import { env } from '@/env'
import { PrismaClient as PrismaClient } from '@prisma/client'
import { PrismaClient as backupPrisma } from '../../backup_prisma/generated/clientBackup'
// Caso esteja em ambiente de desenvolvimento as "querys" do banco de dados
// serão informadas no log da aplicação para efeitos de melhor debug do código
export const prisma = new PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

export const historyDatabase = new backupPrisma()
