import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";

export async function createBankAccountHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const bankAccount = await prisma.bankAccount.findUnique({
        where: { id }
    });
    if (!bankAccount) {
        return null;
    }
    const { id: oldId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, familyMember_id: oldFamilyMemberId, ...bankAccountData } = bankAccount;
    const bankAccountMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldCandidateId || oldResponsibleId || oldFamilyMemberId)!, application_id }
    });
    const newFamilyMemberId = bankAccountMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (bankAccount.candidate_id ? { candidate_id: newFamilyMemberId } : { responsible_id: newFamilyMemberId });
    const createBankAccount = await historyDatabase.bankAccount.create({
        data: { main_id: id, ...bankAccountData, ...idField, application_id }
    });
    const route = `CandidateDocuments/${candidate_id || legalResponsibleId || ''}/statement/${(oldCandidateId || oldResponsibleId || '')}/${bankAccount.id}/`;
    const RouteHDB = await findAWSRouteHDB(candidate_id || legalResponsibleId || '', 'statement', (oldCandidateId || oldResponsibleId)!, bankAccount.id, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB);
}

export async function updateBankAccountHDB(id: string) {
    const bankAccount = await prisma.bankAccount.findUnique({
        where: { id },
        include: { familyMember: true }
    });
    if (!bankAccount) {
        return null;
    }
    const { id: oldId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, familyMember_id: oldFamilyMemberId, ...bankAccountData } = bankAccount;
    let candidateOrResponsible = bankAccount.candidate_id || bankAccount.familyMember?.candidate_id || bankAccount.legalResponsibleId || bankAccount.familyMember?.legalResponsibleId;
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for (const application of openApplications) {
        const { familyMember: none, ...dataToSend } = bankAccountData;
        const updateBankAccount = await historyDatabase.bankAccount.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...dataToSend }
        });
    }
}


export async function deleteBankAccountHDB(id: string) {
    const bankAccount = await prisma.bankAccount.findUnique({
        where: { id },
        include: { familyMember: true }
    });
    if (!bankAccount) {
        return null;
    }
    const { id: oldId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, familyMember_id: oldFamilyMemberId, ...bankAccountData } = bankAccount;
    let candidateOrResponsible = bankAccount.candidate_id || bankAccount.familyMember?.candidate_id || bankAccount.legalResponsibleId || bankAccount.familyMember?.legalResponsibleId;
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for (const application of openApplications) {
        const deleteBankAccount = await historyDatabase.bankAccount.deleteMany({
            where: { main_id: id, application_id: application.id }
        })
    }
}