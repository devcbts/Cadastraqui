
import { prisma } from '@/lib/prisma'
import { historyDatabase } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import getOpenApplications from './find-open-applications';

/// HDB == HistoryDataBase
export async function createIdentityDetailsHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const findIdentityDetails = await prisma.identityDetails.findUnique({
        where: {
            id,
        },
    })
    if (!findIdentityDetails) {
        return null;
    }
    const { id: identityId, candidate_id: mainCandidateId,responsible_id: responsible_id, ...identityDetails } = findIdentityDetails;


    const idField = legalResponsibleId ? { legalResponsibleId: legalResponsibleId } : { candidate_id: candidate_id }

    const createIdentityDetails = await historyDatabase.identityDetails.create({
        data: { main_id: identityId, ...identityDetails, ...idField, application_id }
    });

}
export async function updateIdentityDetailsHDB(id: string) {
    const findIdentityDetails = await prisma.identityDetails.findUnique({
        where: {
            id,
        },
    });
    if (!findIdentityDetails) {
        return null;
    }
    const { id: identityId, candidate_id: mainCandidateId, responsible_id: mainResponsibleId, ...identityDetails } = findIdentityDetails;

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
        const updateIdentityDetails = await historyDatabase.identityDetails.updateMany({
            where: { main_id: identityId, application_id: application.id },
            data: { ...identityDetails },
        });

    }


}