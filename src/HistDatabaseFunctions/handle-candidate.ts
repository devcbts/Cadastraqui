import { prisma } from '@/lib/prisma'
import { historyDatabase } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import getOpenApplications from './find-open-applications';

/// HDB == HistoryDataBase
export async function createCandidateHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const findCandidate = await prisma.candidate.findUnique({
        where: {
            id,
        },
    })
    if (!findCandidate) {
        return null;
    }
    const { id: candidateId, ...candidateDetails } = findCandidate;

    let idField 
    if (legalResponsibleId) {

        const responsibleMapping = await historyDatabase.idMapping.findFirst({
            where: { application_id, mainId: legalResponsibleId }
        })
        idField = { legalResponsibleId: responsibleMapping?.newId }
    }
    const createCandidate = await historyDatabase.candidate.create({
        data: { main_id: candidateId, ...candidateDetails, ...idField, application_id }
    });
    const newCandidateId = createCandidate.id;

    // Save the old and new IDs in the IdMapping table
    await historyDatabase.idMapping.create({
        data: { mainId: id, newId: newCandidateId, application_id }
    });
}
export async function updateCandidateHDB(id: string) {
    const findCandidate = await prisma.candidate.findUnique({
        where: {
            id,
        },
    });
    if (!findCandidate) {
        return null;
    }
    const { id: candidateId, ...candidateDetails } = findCandidate;

    if (!candidateId) {
        return null;
    }
    let openApplications

    openApplications = await getOpenApplications(candidateId);


    if (!openApplications) {
        return null;
    }

    for (const application of openApplications) {
        const updateCandidate = await historyDatabase.candidate.updateMany({
            where: { main_id: candidateId, application_id: application.id },
            data: { ...candidateDetails },
        });

    }
}