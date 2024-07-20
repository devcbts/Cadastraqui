import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder, deleteFromS3Folder } from "@/lib/S3";

export async function createMonthlyIncomeHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const monthlyIncome = await prisma.monthlyIncome.findUnique({
        where: { id }
    })
    if (!monthlyIncome) {
        return null;

    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...monthlyIncomeData } = monthlyIncome;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (monthlyIncome.legalResponsibleId ? { legalResponsibleId: newFamilyMemberId } : { candidate_id: newFamilyMemberId });

    const createMonthlyIncome = await historyDatabase.monthlyIncome.create({
        data: { main_id: monthlyIncome.id, ...monthlyIncomeData, ...idField, application_id }
    });
    const idRoute = legalResponsibleId ? legalResponsibleId : candidate_id;
    if (!idRoute) {
        return null;
    }
    const route = `CandidateDocuments/${idRoute}/monthly-income/${(oldFamilyMemberId || oldCandidateId || oldResponsibleId || '')}/${monthlyIncome.id}/`;
    const RouteHDB = await findAWSRouteHDB(idRoute, 'monthly-income', (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, monthlyIncome.id, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB)
}

export async function updateMonthlyIncomeHDB(id: string) {
    const monthlyIncome = await prisma.monthlyIncome.findUnique({
        where: { id },
        include: { familyMember: true }

    });
    if (!monthlyIncome) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...monthlyIncomeData } = monthlyIncome;
    let candidateOrResponsible = monthlyIncome.candidate_id || monthlyIncome.familyMember?.candidate_id || monthlyIncome.legalResponsibleId || monthlyIncome.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for (const application of openApplications) {
        const { familyMember: none, ...dataToSend } = monthlyIncomeData
        const updateMonthlyIncome = await historyDatabase.monthlyIncome.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...dataToSend }
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