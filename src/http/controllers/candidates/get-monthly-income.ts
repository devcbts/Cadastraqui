import { prisma } from '@/lib/prisma';
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section';
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import { ForbiddenError } from '@/errors/forbidden-error';

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

    const idField = CandidateOrResponsible ? CandidateOrResponsible.IsResponsible ? { responsible_id: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id } : { familyMember_id: _id };

    const monthlyIncomes = await prisma.monthlyIncome.findMany({
      where: idField,
    });
    if (monthlyIncomes.length === 0) {
      const isUnemployed = await prisma.familyMemberIncome.findFirst({
        where: idField
      })
      console.log(isUnemployed)
      if (isUnemployed) {
        return reply.status(200).send({ incomeBySource: { [isUnemployed.employmentType]: [] } })
      }
    }
    type IncomeBySourceAccumulator = Record<string, typeof monthlyIncomes>;


    const urls = await getSectionDocumentsPDF(IsUser.UserData.id, 'monthly-income')

    const incomeBySource = monthlyIncomes.reduce<IncomeBySourceAccumulator>((acc, income) => {
      const source = income.incomeSource ? income.incomeSource : 'Unknown';
      acc[source] = acc[source] || [];
      
      const incomeDocuments = Object.entries(urls).filter(([url]) => url.split("/")[4] === income.id)
      const incomeWithUrls = {
        ...income,
        urls: Object.fromEntries(incomeDocuments),
      }
    
      acc[source].push(incomeWithUrls);
      return acc;
    }, {});

    return reply.status(200).send({ incomeBySource });
  } catch (err: any) {
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message });
    }
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
