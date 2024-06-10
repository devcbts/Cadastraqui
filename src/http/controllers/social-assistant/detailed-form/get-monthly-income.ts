import { historyDatabase, prisma } from '@/lib/prisma';
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getMonthlyIncomeBySourceHDB(request: FastifyRequest, reply: FastifyReply) {


  // Convertendo os valores do enum IncomeSource em um array

  const queryParamsSchema = z.object({
    _id: z.string(),
  });

  const { _id } = queryParamsSchema.parse(request.params);

  try {
    const CandidateOrResponsible = await SelectCandidateResponsible(_id);

    const idField = CandidateOrResponsible ? CandidateOrResponsible.IsResponsible? {responsible_id: CandidateOrResponsible.UserData.id} : {candidate_id: CandidateOrResponsible.UserData.id} : { familyMember_id: _id };

    const monthlyIncomes = await historyDatabase.monthlyIncome.findMany({
      where: idField,
    });
    if (monthlyIncomes.length === 0) {
      const isUnemployed = await historyDatabase.familyMemberIncome.findFirst({
        where: idField
      })
      if (isUnemployed) {
        return reply.status(200).send({ incomeBySource: { [isUnemployed.employmentType]: [] } })
      }
    }
    type IncomeBySourceAccumulator = Record<string, typeof monthlyIncomes>;

    const incomeBySource = monthlyIncomes.reduce<IncomeBySourceAccumulator>((acc, income) => {
      const source = income.incomeSource ? income.incomeSource : 'Unknown';
      acc[source] = acc[source] || [];
      acc[source].push(income);
      return acc;
    }, {});

    return reply.status(200).send({ incomeBySource });
  } catch (err: any) {
    console.error(err);
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
