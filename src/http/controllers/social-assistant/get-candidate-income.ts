import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import { NotAllowedError } from '@/errors/not-allowed-error';
import { z } from 'zod';

export async function getCandidateIncome(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    candidate_id: z.string(),
  });

  try {
    const { candidate_id } = fetchParamsSchema.parse(request.params);

    const familyMembers = await prisma.familyMember.findMany({
      where: { candidate_id },
    });

    let totalIncome = 0;
    let totalFamilyMembers = familyMembers.length;

    for (const member of familyMembers) {
      const familyMember_id = member.id;

      const incomes = await prisma.monthlyIncome.findMany({
        where: { familyMember_id },
      });

      let totalMemberIncome = 0;
      let countValidIncomes = 0;

      for (const income of incomes) {
        const incomeAmount = Number(income.liquidAmount);
        if (incomeAmount > 0) {
          totalMemberIncome += incomeAmount;
          countValidIncomes += 1;
        }
      }

      const averageMemberIncome = countValidIncomes > 0 ? totalMemberIncome / countValidIncomes : 0;
      totalIncome += averageMemberIncome;
    }

    const totalIncomePerCapita = totalIncome / (totalFamilyMembers + 1);

    return reply.status(200).send({ candidate_id, totalIncomePerCapita });
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message });
    }
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
