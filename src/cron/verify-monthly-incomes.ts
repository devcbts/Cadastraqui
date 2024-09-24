import { prisma } from '../lib/prisma';

async function groupAndVerifyIncomes() {
    try {
        // Buscar todas as rendas mensais
        const uniqueGroups = await prisma.monthlyIncome.findMany({
            distinct: ['incomeSource', 'familyMember_id', 'candidate_id', 'legalResponsibleId']
        });

        // Agrupar rendas mensais por incomeSource
       
        // Iterar sobre cada grupo e procurar informações na tabela familyMemberIncome
        for (const group of uniqueGroups) {
            const incomeSource = group.incomeSource;
            const familyMemberIncomes = await prisma.familyMemberIncome.findFirst({
                where: {
                    employmentType: incomeSource,
                    familyMember_id: group.familyMember_id,
                    candidate_id: group.candidate_id,
                    legalResponsibleId: group.legalResponsibleId
                }
            });
            if (familyMemberIncomes) {
                console.log('Update')
                const updateMonthIncome = await prisma.monthlyIncome.updateMany({
                    where: {
                        incomeSource: incomeSource,
                        familyMember_id: group.familyMember_id,
                        candidate_id: group.candidate_id,
                        legalResponsibleId: group.legalResponsibleId
                    },
                    data: {
                        income_id: familyMemberIncomes.id
                    }
                })
            }
            console.log(`Informações na tabela familyMemberIncome:`, familyMemberIncomes);
        }

        console.log("Verificação de rendas mensais concluída.");
    } catch (error) {
        console.error("Erro ao verificar rendas mensais:", error);
    }
}

// Executar o script
groupAndVerifyIncomes();