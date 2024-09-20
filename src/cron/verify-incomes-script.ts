import { verifyIncomeBankRegistration } from "../utils/Trigger-Functions/verify-income-bank-registration";
import { prisma } from "../lib/prisma";

async function verifyAllUsersMonthlyIncome() {
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

        // Iterar sobre todos os IDs e verificar as rendas mensais
        for (const user of allIds) {
            const result = await verifyIncomeBankRegistration(user.id);
            console.log(`Verificação de renda mensal para ${user.isResponsible ? 'Responsável' : 'Candidato'} com ID ${user.id}: ${result}`);
        }

        console.log("Verificação de rendas mensais concluída para todos os usuários.");
    } catch (error) {
        console.error("Erro ao verificar rendas mensais:", error);
    }
}

// Executar o script
verifyAllUsersMonthlyIncome();