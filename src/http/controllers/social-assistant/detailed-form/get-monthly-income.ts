import { historyDatabase } from '@/lib/prisma';
import { SelectCandidateResponsibleHDB } from '@/utils/select-candidate-responsibleHDB';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getSectionDocumentsPDF_HDB } from '../AWS-routes/get-documents-by-section-HDB';

export async function getMonthlyIncomeBySourceHDB(request: FastifyRequest, reply: FastifyReply) {


  // Convertendo os valores do enum IncomeSource em um array

  const queryParamsSchema = z.object({
    application_id: z.string(),
    _id: z.string(),
  });

  const { application_id, _id } = queryParamsSchema.parse(request.params);

  try {
    const CandidateOrResponsible = await SelectCandidateResponsibleHDB(_id);

    const idField = CandidateOrResponsible ? CandidateOrResponsible.IsResponsible ? { legalResponsibleId: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id } : { familyMember_id: _id };

    const monthlyIncomes = await historyDatabase.monthlyIncome.findMany({
      where: idField,
    });
    let result = {};
    if (monthlyIncomes.length === 0) {
      const isUnemployed = await historyDatabase.familyMemberIncome.findMany({
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
        // return reply.status(200).send({ incomeBySource: { [isUnemployed.employmentType]: [] } })
      }
    }
    type IncomeBySourceAccumulator = Record<string, typeof monthlyIncomes>;


    const urls = await getSectionDocumentsPDF_HDB(application_id, 'monthly-income')

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
    console.error(err);
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
