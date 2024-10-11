import { ForbiddenError } from '@/errors/forbidden-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { CalculateIncomePerCapita } from '@/utils/Trigger-Functions/calculate-income-per-capita'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section'

export async function getIncomeInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub
    let candidateOrResponsible
    let idField

    candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }

    // get all family members linked with user
    const familyMembers = await prisma.familyMember.findMany({
      where: idField,
      include: { FamilyMemberIncome: true, BankAccount: true }
    })

    // async function fetchData(familyMembers: FamilyMember[]) {
    const incomeInfoResults = []
    for (const familyMember of familyMembers) {
      try {
        // const familyMemberIncome = await prisma.familyMemberIncome.findMany({
        //   where: { familyMember_id: familyMember.id },
        // })

        const userBanks = familyMember.BankAccount.length
        incomeInfoResults.push({
          name: familyMember.fullName, id: familyMember.id, incomes: familyMember.FamilyMemberIncome, hasBankAccount: familyMember.hasBankAccount, userBanks, isUser: false, isIncomeUpdated: familyMember.isIncomeUpdated,
          isBankUpdated: familyMember.BankAccount.every(e => e.isUpdated), BankAccount: familyMember.BankAccount
        })
      } catch (error) {
        throw new ResourceNotFoundError()
      }
    }
    // return incomeInfoResults
    // }

    const candidateIncome = await prisma.familyMemberIncome.findMany({
      where: idField,
    })
    const userIdentity = await prisma.identityDetails.findFirst({
      where: { OR: [{ candidate_id: candidateOrResponsible.UserData.id }, { responsible_id: candidateOrResponsible.UserData.id }] },
      select: {
        hasBankAccount: true,
        candidate: { select: { _count: { select: { BankAccount: true } }, BankAccount: { select: { isUpdated: true } } } },
        responsible: { select: { _count: { select: { BankAccount: true } }, BankAccount: { select: { isUpdated: true } } }, },
        isIncomeUpdated: true
      }
    })
    const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'income')

    const userBanks = candidateOrResponsible.IsResponsible ? userIdentity?.responsible?._count.BankAccount : userIdentity?.candidate?._count.BankAccount
    // let incomeInfoResults = await fetchData(familyMembers)
    incomeInfoResults.push({
      name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, incomes: candidateIncome, hasBankAccount: userIdentity?.hasBankAccount, userBanks, isUser: true, isIncomeUpdated: userIdentity?.isIncomeUpdated,
      isBankUpdated: (
        !!userIdentity?.candidate
          ? !!userIdentity?.candidate?.BankAccount.length && userIdentity?.candidate?.BankAccount.every(e => e.isUpdated)
          : !!userIdentity?.responsible?.BankAccount.length && userIdentity?.responsible?.BankAccount.every(e => e.isUpdated)
      )
    })
    const incomeInfoResultsWithUrls = incomeInfoResults.map((familyMember) => {
      const incomesWithUrls = familyMember.incomes.map((income) => {
        const incomeDocuments = Object.entries(urls).filter(([url]) => url.split("/")[4] === income.id)
        return {
          ...income,
          urls: Object.fromEntries(incomeDocuments),
        }
      })
      const isUpdated = !!familyMember.incomes.length
        && familyMember.incomes.every(income => income.isUpdated)
        && (familyMember.isBankUpdated || familyMember.hasBankAccount === false);
      console.log(familyMember.name, familyMember.hasBankAccount,)
      return {
        ...familyMember,
        incomes: incomesWithUrls,
        hasBankAccount: familyMember.hasBankAccount,
        isUpdated
      }
    })
    const averageIncome = await CalculateIncomePerCapita(candidateOrResponsible.UserData.id)

    const incomeInfoResultsWithAverageIncome = incomeInfoResultsWithUrls.map((memberIncome) => {
      const averageMemberIncome = Object.keys(averageIncome.incomesPerMember).find((key) => key === memberIncome.id)
      return {
        ...memberIncome,
        averageIncome: averageMemberIncome ? averageIncome.incomesPerMember[averageMemberIncome] : 0
      }
    })
    return reply.status(200).send({ incomeInfoResults: incomeInfoResultsWithAverageIncome, averageIncome: averageIncome.incomePerCapita })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}

export async function getMemberIncomeStatus(request: FastifyRequest, reply: FastifyReply) {

  const memberParamsSchema = z.object({
    _id: z.string()
  })


  const { _id } = memberParamsSchema.parse(request.params)
  try {
    const user = await SelectCandidateResponsible(request.user.sub)
    const user_id = user?.UserData.id

    let member;
    let idField;
    let bankAccountUpdated;
    let IncomesUpdated;
    let CCS_Updated;
    if (_id === user_id) {
      member = await prisma.identityDetails.findFirstOrThrow({ where: { OR: [{ candidate_id: _id }, { responsible_id: _id }] } });
      idField = member.responsible_id ? { legalResponsibleId: member.responsible_id } : { candidate_id: member.candidate_id }
    }
    else {
      member = await prisma.familyMember.findFirstOrThrow({
        where: { id: _id },
      })
      idField = { familyMember_id: _id }
    }

    const bankAccounts = await prisma.bankAccount.findMany({
      where: idField
    })
    console.log('contas', bankAccounts)

    // verificar o status da conta bancária
    if ((!bankAccounts.length && member.hasBankAccount) || member.hasBankAccount === null) {
      bankAccountUpdated = null;
    }
    else if (bankAccounts.some(bankAccount => bankAccount.isUpdated === false)) {
      bankAccountUpdated = false;
    }
    else {
      bankAccountUpdated = true;
    }

    // verificar o status da renda
    const incomes = await prisma.familyMemberIncome.findMany({
      where: idField
    })
    if (!incomes.length) {
      IncomesUpdated = null;
    }
    else if (incomes.some(income => income.isUpdated === false)) {
      IncomesUpdated = false;
    }
    else {
      IncomesUpdated = true;
    }

    // verificar o status do CCS

    const pix = await prisma.candidateDocuments.findFirst({
      where: {
        tableName: 'pix',
        tableId: _id
      }
    })
    const registrato = await prisma.candidateDocuments.findFirst({
      where: {
        tableName: 'registrato',
        tableId: _id
      }
    })
    if (pix?.status === 'PENDING' || registrato?.status === 'PENDING') {
      CCS_Updated = false;
    }
    else if (!pix || !registrato) {
      CCS_Updated = null;
    }
    else {
      CCS_Updated = true;
    }

    return reply.status(200).send({ bankAccountUpdated, IncomesUpdated, CCS_Updated })


  } catch (error: any) {
    if (error instanceof ForbiddenError) {
      return reply.status(403).send({ message: error.message })
    }
    return reply.status(500).send({ message: error.message })
  }
}