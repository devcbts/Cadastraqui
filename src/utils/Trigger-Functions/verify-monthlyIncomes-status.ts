import { prisma } from '@/lib/prisma'
import { DocumentAnalysisStatus } from '@prisma/client'

export async function VerifyMonthlyIncomeStatus(incomeId: string) {
  // Procurar o familyMemberIncome associado a renda mensal
  const income = await prisma.familyMemberIncome.findUnique({
    where: { id: incomeId },
    include: {
        MonthlyIncomes: true
    }
  })
  if (!income) {
    return
  }
  let isUpdated = true
  let updatedStatus : DocumentAnalysisStatus = 'Approved'
  const monthlyIncomes = income.MonthlyIncomes
  // Verificar o status de todas as rendas mensais
  for (const monthlyIncome of  monthlyIncomes) {
    if (monthlyIncome.analysisStatus === 'Declined') {
      isUpdated = false
      updatedStatus = 'Declined'
      break
    }
    if (monthlyIncome.analysisStatus === 'Forced') {
      updatedStatus = 'Forced'
      break
    }
  }

  // Se o número de rendas for menor que 6, mude o isUpdated para false
  if (monthlyIncomes.length < 6) {
    isUpdated = false
  }

  // Atualizar o status do familyMemberIncome
  await prisma.familyMemberIncome.update({
    where: { id: incomeId },
    data: { isUpdated, updatedStatus }
  })
}