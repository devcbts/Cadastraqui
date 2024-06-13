import { prisma } from '@/lib/prisma'
import { historyDatabase } from '@/lib/prisma'
import getOpenApplications from './find-open-applications';

/// HDB == HistoryDataBase
export async function createResponsibleHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const findResponsible = await prisma.legalResponsible.findUnique({
        where: {
            id,
        },
    })
    if (!findResponsible) {
        return null;
    }
    const { id: responsibleId,finishedRegistrationId: unused, ...responsibleDetails } = findResponsible;


    
    const createResponsible = await historyDatabase.legalResponsible.create({
        data: { main_id: responsibleId, ...responsibleDetails, application_id }
    });
    const newResponsibleId = createResponsible.id;

    // Save the old and new IDs in the IdMapping table
    await historyDatabase.idMapping.create({
        data: { mainId: id, newId: newResponsibleId, application_id }
    });
}
export async function updateResponsibleHDB(id: string) {
    const findResponsible = await prisma.legalResponsible.findUnique({
        where: {
            id,
        },
    });
    if (!findResponsible) {
        return null;
    }
    const { id: responsibleId, ...responsibleDetails } = findResponsible;

    if (!responsibleId) {
        return null;
    }
    let openApplications
   
    openApplications = await getOpenApplications(responsibleId);
   

    if (!openApplications) {
        return null;
    }

    for (const application of openApplications) {
        const updateResponsible = await historyDatabase.legalResponsible.updateMany({
            where: { main_id: responsibleId, application_id: application.id },
            data: { ...responsibleDetails },
        });

    }
}