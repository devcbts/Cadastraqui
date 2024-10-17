import { historyDatabase } from '@/lib/prisma';
import { SelectCandidateResponsibleHDB } from '@/utils/select-candidate-responsibleHDB';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getSectionDocumentsPDF_HDB } from "../../social-assistant/AWS-routes/get-documents-by-section-HDB";

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

    const memberIncomes = await historyDatabase.familyMemberIncome.findMany({
      where: idField,
      include: { MonthlyIncomes: true }
    });




    const urlsMonthlyIncome = await getSectionDocumentsPDF_HDB(application_id, `monthly-income/${_id}`)
    const urlsIncome = await getSectionDocumentsPDF_HDB(application_id, `income/${_id}`)

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
      };
    });
    return reply.status(200).send({ incomeBySource });
  } catch (err: any) {
    console.error(err);
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
