import { prisma } from '@/lib/prisma'
import { historyDatabase } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import getOpenApplications from './find-open-applications';
import { findAWSRouteHDB } from './Handle Application/find-AWS-Route';
import { copyFilesToAnotherFolder } from '@/lib/S3';

/// HDB == HistoryDataBase
export async function createFamilyMemberHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const findFamilyMember = await prisma.familyMember.findUnique({
        where: {
            id,
        },
    })
    if (!findFamilyMember) {
        return null;
    }
    const { id: familyMemberId, candidate_id: mainCandidateId, legalResponsibleId: mainResponsibleId, ...familyMemberDetails } = findFamilyMember;

    const newId = await historyDatabase.idMapping.findFirst({
        where: { mainId: (mainCandidateId || mainResponsibleId)!, application_id }
    
    })
   const idField = mainCandidateId ? { candidate_id: newId?.newId } : { legalResponsibleId: newId?.newId };
    
    const createFamilyMember = await historyDatabase.familyMember.create({
        data: { main_id: familyMemberId, ...familyMemberDetails, ...idField, application_id }
    });
    const newFamilyMemberId = createFamilyMember.id;

    // Save the old and new IDs in the IdMapping table
    await historyDatabase.idMapping.create({
        data: { mainId: id, newId: newFamilyMemberId, application_id }
    });
    const idRoute = mainCandidateId ? candidate_id : legalResponsibleId;
    if (!idRoute) {
        return null;
    }
    const route = `CandidateDocuments/${idRoute}/family-member/${id}/`;
    const RouteHDB = await findAWSRouteHDB(idRoute , 'family-member', familyMemberId, null, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB)

}
export async function updateFamilyMemberHDB(id: string) {
    const findFamilyMember = await prisma.familyMember.findUnique({
        where: {
            id,
        },
    });
    if (!findFamilyMember) {
        return null;
    }
    const { id: familyMemberId, candidate_id: mainCandidateId, legalResponsibleId: mainResponsibleId, ...familyMemberDetails } = findFamilyMember;

    if (!mainCandidateId && !mainResponsibleId) {
        return null;
    }
    let openApplications
    if (mainCandidateId) {
        openApplications = await getOpenApplications(mainCandidateId);

    }
    if (mainResponsibleId) {
        openApplications = await getOpenApplications(mainResponsibleId);
    }

    if (!openApplications) {
        return null;
    }

    for (const application of openApplications) {
        const updateFamilyMember = await historyDatabase.familyMember.updateMany({
            where: { main_id: familyMemberId, application_id: application.id },
            data: { ...familyMemberDetails },
        });

    }
}


export async function deleteFamilyMemberHDB(id: string, memberId: string) {
    const member = await prisma.familyMember.findUnique({
        where: { id: memberId }
    })
    let candidateOrResponsibleId = member?.candidate_id || member?.legalResponsibleId || memberId;
    const openApplications = await getOpenApplications(candidateOrResponsibleId);
    if (!openApplications) {
        return null;
    }
    for (const application of openApplications) {
        const deleteFamilyMember = await historyDatabase.familyMember.deleteMany({
            where: { main_id: id, application_id: application.id },
        });
    }
}