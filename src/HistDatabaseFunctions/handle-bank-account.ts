import getCandidateDocument from "@/http/controllers/candidates/Documents Functions/get-candidate-document";
import { historyDatabase, prisma } from "@/lib/prisma";
import { copyFilesToAnotherFolder, deleteFromS3Folder } from "@/lib/S3";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { createCandidateDocumentHDB } from "./Handle Documents/handle-candidate-document";

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
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (bankAccount.candidate_id ? { candidate_id: newFamilyMemberId } : { legalResponsibleId: newFamilyMemberId });
    const createBankAccount = await historyDatabase.bankAccount.create({
        data: { main_id: id, ...bankAccountData, ...idField, application_id }
    });
    const idRoute = legalResponsibleId ? legalResponsibleId : candidate_id;
    if (!idRoute) {
        return null;
    }
    const route = `CandidateDocuments/${idRoute}/statement/${(oldCandidateId || oldResponsibleId || '')}/${bankAccount.id}/`;
    const RouteHDB = await findAWSRouteHDB(idRoute, 'statement', (oldCandidateId || oldResponsibleId || oldFamilyMemberId)!, bankAccount.id, application_id);
    const copyFiles = await getCandidateDocument("statement", bankAccount.id);

    await historyDatabase.$transaction(async (tsPrismaHDB) => {
        for (const file of copyFiles) {
            const metadata = file.metadata ?? {}; // Provide a default value if metadata is null

            await createCandidateDocumentHDB(tsPrismaHDB, `${RouteHDB}${file.path.split('/').pop()}`, route, metadata, 'statement', bankAccount.id, null, application_id);
        }
    });
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


export async function deleteBankAccountHDB(id: string, memberId: string) {
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
    } const openApplications = await getOpenApplications(candidateOrResponsibleId);
    if (!openApplications) {
        return null;
    }


    const route = `CandidateDocuments/${candidateOrResponsibleId}/statement/${(memberId)}/${id}/`;
    await deleteFromS3Folder(route)

    for (const application of openApplications) {
        const RouteHDB = await findAWSRouteHDB(candidateOrResponsibleId, 'statement', (memberId)!, id, application.id);
        await deleteFromS3Folder(RouteHDB);
        const deleteBankAccount = await historyDatabase.bankAccount.deleteMany({
            where: { main_id: id, application_id: application.id }
        })
        await historyDatabase.candidateDocuments.deleteMany({
            where: { tableId: id, application_id: application.id }
        })
    }
}