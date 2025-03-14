import { ForbiddenError } from '@/errors/forbidden-error';
import { prisma } from '@/lib/prisma';
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section';

export async function getMonthlyIncomeBySource(request: FastifyRequest, reply: FastifyReply) {
  const IncomeSource = z.enum([
    'PrivateEmployee',
    "PublicEmployee",
    "DomesticEmployee",
    "TemporaryRuralEmployee",
    "BusinessOwnerSimplifiedTax",
    "BusinessOwner",
    "IndividualEntrepreneur",
    "SelfEmployed",
    "Retired",
    "Pensioner",
    "Apprentice",
    "Volunteer",
    "RentalIncome",
    "Student",
    "InformalWorker",
    "Unemployed",
    "TemporaryDisabilityBenefit",
    "LiberalProfessional",
    "FinancialHelpFromOthers",
    "Alimony",
    "PrivatePension"
  ]);

  // Convertendo os valores do enum IncomeSource em um array

  const queryParamsSchema = z.object({
    _id: z.string(),
  });

  const { _id } = queryParamsSchema.parse(request.params);

  try {
    const user_id = request.user.sub;
    const IsUser = await SelectCandidateResponsible(user_id);
    if (!IsUser) {
      throw new ForbiddenError()
    }
    const CandidateOrResponsible = await SelectCandidateResponsible(_id);

    const idField = CandidateOrResponsible ? CandidateOrResponsible.IsResponsible ? { legalResponsibleId: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id } : { familyMember_id: _id };
    let result = {};

    const memberIncomes = await prisma.familyMemberIncome.findMany({
      where: idField,
      include: { MonthlyIncomes: true }
    });

    const urlsMonthlyIncome = await getSectionDocumentsPDF(IsUser.UserData.id, `monthly-income/${_id}`)

    const urlsIncome = await getSectionDocumentsPDF(IsUser.UserData.id, 'income')

    const incomeBySource = memberIncomes.map(income => {
      const source = income.employmentType ? income.employmentType : 'Unknown';
      const monthlyIncomes = income.MonthlyIncomes.map(monthlyIncome => {
        const monthlyIncomeDocuments = Object.entries(urlsMonthlyIncome).filter(([url]) => url.split("/")[4] === monthlyIncome.id);
        return {
          ...monthlyIncome,
          urls: Object.fromEntries(monthlyIncomeDocuments),
        };
      });
      const IncomeDocuments = Object.entries(urlsIncome).filter(([url]) => url.split("/")[4] === income.id);

      return {
        incomeSource: source,
        urls: Object.fromEntries(IncomeDocuments),
        monthlyIncomes: monthlyIncomes,
        analysisStatus: income.updatedStatus
      };
    });
    return reply.status(200).send({ incomeBySource });
  } catch (err: any) {
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message });
    }
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
