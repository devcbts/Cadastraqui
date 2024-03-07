import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import { NotAllowedError } from '@/errors/not-allowed-error';
import { z } from 'zod';

interface Candidate {
  candidate_id: string;
  totalIncomePerCapita: number;
  educationLevel_id: string;
}
enum IncomeSource {
  PrivateEmployee = 'PrivateEmployee',
  PublicEmployee = 'PublicEmployee',
  DomesticEmployee = 'DomesticEmployee',
  TemporaryRuralEmployee = 'TemporaryRuralEmployee',
  BusinessOwnerSimplifiedTax = 'BusinessOwnerSimplifiedTax',
  BusinessOwner = 'BusinessOwner',
  IndividualEntrepreneur = 'IndividualEntrepreneur',
  SelfEmployed = 'SelfEmployed',
  Retired = 'Retired',
  Pensioner = 'Pensioner',
  Apprentice = 'Apprentice',
  Volunteer = 'Volunteer',
  RentalIncome = 'RentalIncome',
  Student = 'Student',
  InformalWorker = 'InformalWorker',
  Unemployed = 'Unemployed',
  TemporaryDisabilityBenefit = 'TemporaryDisabilityBenefit',
  LiberalProfessional = 'LiberalProfessional',
  FinancialHelpFromOthers = 'FinancialHelpFromOthers',
  Alimony = 'Alimony',
  PrivatePension = 'PrivatePension',
}

interface MemberIncomeInfo {
  totalIncomeByType: Record<IncomeSource, number>;
  incomesCountByType: Record<IncomeSource, number>;
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
        include: {
          MonthlyIncome: true, // Inclui os rendimentos mensais dos membros da família
        },
      });


      const candidateIncomes = await prisma.monthlyIncome.findMany({
        where: { candidate_id },
      });

      let memberIncomeDetails: Record<string, MemberIncomeInfo> = {};
      function initializeIncomeRecord(): Record<IncomeSource, number> {
        const record: Record<IncomeSource, number> = {} as Record<IncomeSource, number>;
        for (const incomeSourceKey in IncomeSource) {
          const key = IncomeSource[incomeSourceKey as keyof typeof IncomeSource];
          record[key] = 0;
        }
        return record;
      }

      // Função para inicializar o registro de renda para um membro
      function initializeMemberIncome(): MemberIncomeInfo {
        return {
          totalIncomeByType: initializeIncomeRecord(),
          incomesCountByType: initializeIncomeRecord(),
        };
      }

      // Processamento para o candidato
      memberIncomeDetails[candidate_id] = initializeMemberIncome(); // Inicializa para o candidato
      candidateIncomes.forEach(income => {
        if (income.incomeSource && income.liquidAmount && income.liquidAmount > 0) {
          const type = income.incomeSource as IncomeSource;
          memberIncomeDetails[candidate_id].totalIncomeByType[type] += income.liquidAmount;
          memberIncomeDetails[candidate_id].incomesCountByType[type] += 1;
        }
      });

      // Processamento para cada membro da família
      familyMembers.forEach(member => {
        // Inicializa registro de renda para o membro
        memberIncomeDetails[member.id] = initializeMemberIncome();

        member.MonthlyIncome.forEach(income => {
          if (income.incomeSource && income.liquidAmount && income.liquidAmount > 0) {
            const type = income.incomeSource as IncomeSource;
            memberIncomeDetails[member.id].totalIncomeByType[type] += income.liquidAmount;
            memberIncomeDetails[member.id].incomesCountByType[type] += 1;
          }
        });
      });

      let totalSumOfAverageIncomes = 0;
      let totalPeopleCount = 0;

      // Cálculo das médias por membro e tipo de emprego
      Object.keys(memberIncomeDetails).forEach(memberId => {
        const details = memberIncomeDetails[memberId];
        let totalAverageIncomeForMember = 0;
        let incomeTypesCount = 0;

        // Calcula a soma das médias para cada tipo de emprego para o membro
        Object.keys(details.totalIncomeByType).forEach((typeKey) => {
          const type = typeKey as IncomeSource;

          const averageIncomeByType = details.incomesCountByType[type] ? details.totalIncomeByType[type] / details.incomesCountByType[type] : 0;
          if (averageIncomeByType > 0) {
            totalAverageIncomeForMember += averageIncomeByType;

            incomeTypesCount++;
          }
        });

        // Caso existam tipos de renda, adiciona a média do membro à soma total
        if (incomeTypesCount > 0) {
          const averageIncomePerMember = totalAverageIncomeForMember / incomeTypesCount;
          totalSumOfAverageIncomes += averageIncomePerMember;
        }

        // Incrementa a contagem total de pessoas (cada membro + o candidato)
        totalPeopleCount++;
      });
      // Calcula a renda per capita do grupo familiar

      const totalIncomePerCapita = totalPeopleCount > 0 ? totalSumOfAverageIncomes / totalPeopleCount : 0;
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
