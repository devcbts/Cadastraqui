
import { prisma } from '@/lib/prisma'
import { historyDatabase } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import getOpenApplications from './find-open-applications';
import { findAWSRouteHDB } from './Handle Application/find-AWS-Route';
import { copyFilesToAnotherFolder } from '@/lib/S3';

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


    const newId = await historyDatabase.idMapping.findFirst({
        where: { mainId: (mainCandidateId || responsible_id)!, application_id }
    
    })
   const idField = mainCandidateId ? { candidate_id: newId?.newId } : { legalResponsibleId: newId?.newId };

    const createIdentityDetails = await historyDatabase.identityDetails.create({
        data: { main_id: identityId, ...identityDetails, ...idField, application_id }
    });
    const route = `CandidateDocuments/${candidate_id || legalResponsibleId || ''}/identity/${candidate_id || legalResponsibleId || ''}/`;
    const RouteHDB = await findAWSRouteHDB(candidate_id || legalResponsibleId || '' , 'identity', candidate_id || legalResponsibleId || '', null, application_id)
    await copyFilesToAnotherFolder(route, RouteHDB)

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