import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

// Caso esteja em ambiente de desenvolvimento as "querys" do banco de dados
// serão informadas no log da aplicação para efeitos de melhor debug do código
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
