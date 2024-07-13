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
    const monthlyIncomes = await prisma.monthlyIncome.findMany({
      where: idField,
    });
    if (monthlyIncomes.length === 0) {
      const isUnemployed = await prisma.familyMemberIncome.findMany({
        where: idField
      })
      console.log(isUnemployed)
      if (isUnemployed.length) {
        const types = isUnemployed.reduce((acc: any, e) => {
          acc[e.employmentType] = []
          return acc
        }, {})
        result = {
          ...result,
          ...types
        }
        return reply.status(200).send({ incomeBySource: result })
      }
    }
    type IncomeBySourceAccumulator = Record<string, typeof monthlyIncomes | any>;


    const urls = await getSectionDocumentsPDF(IsUser.UserData.id, `monthly-income/${_id}`)

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
