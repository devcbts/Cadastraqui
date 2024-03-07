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

  try {
    const { candidate_id } = fetchParamsSchema.parse(request.params);

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
    
    let totalAverageIncomeForMember = 0;
    console.log(memberIncomeDetails)
    // Cálculo das médias por membro e tipo de emprego
    Object.keys(memberIncomeDetails).forEach(memberId => {
      const details = memberIncomeDetails[memberId];
      Object.keys(details.totalIncomeByType).forEach((typeKey) => {
        const type = typeKey as IncomeSource;
        const averageIncomeByType = details.totalIncomeByType[type] / details.incomesCountByType[type];
        totalAverageIncomeForMember += averageIncomeByType; // Soma das médias para cada tipo de emprego para o membro
      });
    });
    console.log(totalAverageIncomeForMember)
    let totalIncomePerCapita = totalAverageIncomeForMember;
    return reply.status(200).send({ candidate_id, totalIncomePerCapita });
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message });
    }
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}

