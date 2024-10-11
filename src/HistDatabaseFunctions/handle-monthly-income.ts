import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder, deleteFromS3Folder } from "@/lib/S3";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para buscar o idMapping com repetição
async function fetchIdMappingWithRetry(mainId: string, application_id: string, maxRetries: number = 3) {
    let attempts = 0;
    let idMapping = null;

    while (attempts < maxRetries) {
        idMapping = await historyDatabase.idMapping.findFirst({
            where: { mainId, application_id }
        });

        if (idMapping) {
            break;
        }

        attempts++;
        await delay(3000); // Espera 3 segundos antes de tentar novamente
    }

    return idMapping;
}

export async function createMonthlyIncomeHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const monthlyIncome = await prisma.monthlyIncome.findUnique({
        where: { id }
    });
    if (!monthlyIncome) {
        return null;
    }

    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, income_id: income_id, ...monthlyIncomeData } = monthlyIncome;

    const familyMemberMapping = await fetchIdMappingWithRetry((oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id);
    if (!familyMemberMapping) {
        throw new Error("idMapping não encontrado após várias tentativas.");
    }
    const newFamilyMemberId = familyMemberMapping.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (monthlyIncome.legalResponsibleId ? { legalResponsibleId: newFamilyMemberId } : { candidate_id: newFamilyMemberId });

    const incomeMapping = await fetchIdMappingWithRetry((income_id ?? undefined)!, application_id);
    if (!incomeMapping) {
        throw new Error("idMapping não encontrado após várias tentativas.");
    }
    const newIncomeId = incomeMapping.newId;

    const createMonthlyIncome = await historyDatabase.monthlyIncome.create({
        data: { main_id: monthlyIncome.id, ...monthlyIncomeData, ...idField, income_id: newIncomeId, application_id }
    });

    const idRoute = legalResponsibleId ? legalResponsibleId : candidate_id;
    if (!idRoute) {
        return null;
    }
    const route = `CandidateDocuments/${idRoute}/monthly-income/${(oldFamilyMemberId || oldCandidateId || oldResponsibleId || '')}/${monthlyIncome.id}/`;
    const RouteHDB = await findAWSRouteHDB(idRoute, 'monthly-income', (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, monthlyIncome.id, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB);
}

export async function updateMonthlyIncomeHDB(id: string) {
    const monthlyIncome = await prisma.monthlyIncome.findUnique({
        where: { id },
        include: { familyMember: true }

    });
    if (!monthlyIncome) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, income_id:income_id , ...monthlyIncomeData } = monthlyIncome;
    let candidateOrResponsible = monthlyIncome.candidate_id || monthlyIncome.familyMember?.candidate_id || monthlyIncome.legalResponsibleId || monthlyIncome.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    
    for (const application of openApplications) {
        const incomeMapping = await historyDatabase.idMapping.findFirst({
            where: { mainId: income_id ?? undefined, application_id: application.id }
        });
        
        const { familyMember: none, ...dataToSend } = monthlyIncomeData;
        let HisotryincomeId
        // Verifica se incomeMapping?.newId não é undefined antes de atualizar income_id
        if (incomeMapping?.newId !== undefined) {
            HisotryincomeId = incomeMapping.newId;
        }
        const idField = HisotryincomeId ? { income_id: HisotryincomeId } : {  };
        const updateMonthlyIncome = await historyDatabase.monthlyIncome.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...dataToSend, ...idField } 
        });
    }
}
export async function deleteMonthlyIncomeHDB(id: string, memberId: string) {
    const member = await prisma.familyMember.findUnique({
        where: { id: memberId }
    })
    const deletedMember = member ? '' : await prisma.deletedFamilyMembers.findUnique({
        where: { familyMember_id: memberId }
    })
    let candidateOrResponsibleId;

    if (member) {
        candidateOrResponsibleId = member.candidate_id || member.legalResponsibleId;
    }
    
    if (!candidateOrResponsibleId && deletedMember) {
        candidateOrResponsibleId = (deletedMember as { id: string; familyMember_id: string; candidateOrResponsibleId: string; }).candidateOrResponsibleId;
    }
    
    if (!candidateOrResponsibleId) {
        candidateOrResponsibleId = memberId;
    }
    const openApplications = await getOpenApplications(candidateOrResponsibleId);
    if (!openApplications) {
        return null;
    }
    const route = `CandidateDocuments/${candidateOrResponsibleId}/monthly-income/${(memberId)}/${id}/`;
    await deleteFromS3Folder(route)
    for (const application of openApplications) {
        const RouteHDB = await findAWSRouteHDB(candidateOrResponsibleId, 'monthly-income', (memberId)!, id, application.id);
        await deleteFromS3Folder(RouteHDB)
        await historyDatabase.monthlyIncome.deleteMany({
            where: { main_id: id, application_id: application.id },
        });
       
    }
}