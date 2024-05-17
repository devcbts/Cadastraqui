import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";

export async function createFinancingHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const financing = await prisma.financing.findUnique({
        where: {id}
    })
    if (!financing) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId,candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...financingData } = financing;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (candidate_id ? { candidate_id: candidate_id } : { responsible_id: legalResponsibleId });

    const createFinancing = await historyDatabase.financing.create({
            data: {main_id:id, ...financingData, ...idField, application_id }
    });
}

export async function updateFinancingHDB(id: string) {
    const financing = await prisma.financing.findUnique({
        where: { id },
        include:{ familyMember: true}

    });
    if (!financing) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...financingData } = financing;
    let candidateOrResponsible = financing.candidate_id || financing.familyMember?.candidate_id || financing.legalResponsibleId || financing.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){

        const updateFinancing = await historyDatabase.financing.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...financingData }
        });
    }
}