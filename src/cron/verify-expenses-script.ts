import { prisma } from "../lib/prisma";
import verifyExpenses from "../utils/Trigger-Functions/verify-expenses";

async function verifyAllUsersExpenses() {
    try {
        // Buscar todos os candidatos
        const candidates = await prisma.candidate.findMany({
            where: {
            user: { isNot: null }
            },
            select: { id: true }
        });

        // Buscar todos os responsáveis legais
        const legalResponsibles = await prisma.legalResponsible.findMany({
            select: { id: true }
        });

        // Combinar todos os IDs em um único array
        const allIds = [
            ...candidates.map(candidate => ({ id: candidate.id, isResponsible: false })),
            ...legalResponsibles.map(responsible => ({ id: responsible.id, isResponsible: true }))
        ];

        // Iterar sobre todos os IDs e verificar as despesas
        for (const user of allIds) {
            const result = await verifyExpenses(user.id);
            console.log(`Verificação para ${user.isResponsible ? 'Responsável' : 'Candidato'} com ID ${user.id}: ${result}`);
        }

        console.log("Verificação de despesas concluída para todos os usuários.");
    } catch (error) {
        console.error("Erro ao verificar despesas:", error);
    }
}

// Executar o script
verifyAllUsersExpenses();


import { subMonths, startOfMonth } from 'date-fns';

async function deleteOldIncomes() {
    try {
        // Calcular a data limite (6 meses atrás a partir do início do mês atual)
        const sixMonthsAgo = subMonths(new Date(), 6);
        const cutoffDate = startOfMonth(sixMonthsAgo);

        // Deletar todas as rendas com mais de 6 meses
        const deletedIncomes = await prisma.monthlyIncome.deleteMany({
            where: {
                date: {
                    lt: cutoffDate
                }
            }
        });

        console.log(`Rendas deletadas: ${deletedIncomes.count}`);
    } catch (error) {
        console.error("Erro ao deletar rendas antigas:", error);
    }
}

// Executar o script
//deleteOldIncomes();