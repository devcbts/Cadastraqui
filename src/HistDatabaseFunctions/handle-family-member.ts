import { prisma } from '@/lib/prisma'
import { historyDatabase } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import getOpenApplications from './find-open-applications';

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


    const idField = legalResponsibleId ? { legalResponsibleId: legalResponsibleId } : { candidate_id: candidate_id }

    const createFamilyMember = await historyDatabase.familyMember.create({
        data: { main_id: familyMemberId, ...familyMemberDetails, ...idField, application_id }
    });
    const newFamilyMemberId = createFamilyMember.id;

    // Save the old and new IDs in the IdMapping table
    await historyDatabase.idMapping.create({
        data: { mainId: id, newId: newFamilyMemberId, application_id }
    });
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