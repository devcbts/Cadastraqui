import { prisma } from '@/lib/prisma'
import { historyDatabase } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import getOpenApplications from './find-open-applications';

/// HDB == HistoryDataBase
export async function createHousingHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    
    const findHousing = await prisma.housing.findUnique({
        where: {
            id,
        },
    })
    if (!findHousing) {
        return null;
    }
    const { id: housingId, candidate_id: mainCandidateId,responsible_id: responsible_id, ...housingDetails } = findHousing;


    const idField = legalResponsibleId ? { legalResponsibleId: legalResponsibleId } : { candidate_id: candidate_id }


    const createHousing = await historyDatabase.housing.create({
        data: { main_id: housingId, ...housingDetails, ...idField, application_id }
    });

}
export async function updateHousingHDB(id: string) {

    const findHousing = await prisma.housing.findUnique({
        where: {
            id,
        },
    });
    if (!findHousing) {
        return null;
    }
    const { id: housingId, candidate_id: mainCandidateId, responsible_id: mainResponsibleId, ...housingDetails } = findHousing;
    console.log("teste")
    if (!mainCandidateId && !mainResponsibleId) {
        return null;
    }
    const idField = mainResponsibleId ? { responsible_id: mainResponsibleId } : { candidate_id: mainCandidateId };
    let openApplications
    if (mainCandidateId) {
        openApplications = await getOpenApplications(mainCandidateId);

    }
    if (mainResponsibleId) {
        openApplications = await getOpenApplications(mainResponsibleId);
    }
    console.log(openApplications)
    if (!openApplications) {
        return null;
    }

    for (const application of openApplications) {
        const updateHousing = await historyDatabase.housing.updateMany({
            where: { main_id: housingId, application_id: application.id },
            data: { ...housingDetails, },
        });

    }


}