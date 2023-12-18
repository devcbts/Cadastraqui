import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import { NotAllowedError } from '@/errors/not-allowed-error';
import { z } from 'zod';

interface Candidate {
  candidate_id: string;
  totalIncomePerCapita: number;
  educationLevel_id: string;
}

export async function rankCandidatesIncome(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    announcement_id: z.string(),
  });

  try {
    const { announcement_id } = fetchParamsSchema.parse(request.params);

    const applications = await prisma.application.findMany({
      where: { announcement_id },
     
    });

    const incicialList: any[] = [];

    for (const candidateApplication of applications) {
      const candidate_id = candidateApplication.candidate_id;
      const educationLevel_id = candidateApplication.educationLevel_id;

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
      incicialList.push({ candidateApplication, totalIncomePerCapita, educationLevel_id });
    }

    function separateAndSortByEducation(list: any[]) {
      const separatedArrays: { [key: string]: any[] } = {};

      list.forEach((item) => {
        const { educationLevel_id } = item;

        if (!separatedArrays[educationLevel_id]) {
          separatedArrays[educationLevel_id] = [];
        }

        separatedArrays[educationLevel_id].push(item);
      });

      for (const key in separatedArrays) {
        separatedArrays[key].sort((a, b) => a.totalIncomePerCapita - b.totalIncomePerCapita);
      }

      return separatedArrays;
    }

    const rankedList = separateAndSortByEducation(incicialList);

    return reply.status(200).send({ rankedList });
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message });
    }
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
