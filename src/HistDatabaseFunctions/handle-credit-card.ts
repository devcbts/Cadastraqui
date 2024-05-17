import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";

export async function createCreditCardHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const creditCard = await prisma.creditCard.findUnique({
        where: {id}
    })
    if (!creditCard) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId,candidate_id: oldCandidateId,legalResponsibleId: oldResponsibleId, ...creditCardData } = creditCard;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (candidate_id ? { candidate_id: newFamilyMemberId } : { responsible_id: newFamilyMemberId });

    const createCreditCard = await historyDatabase.creditCard.create({
            data: {main_id:creditCard.id, ...creditCardData, ...idField, application_id }
    });
}

export async function updateCreditCardHDB(id: string) {
    const creditCard = await prisma.creditCard.findUnique({
        where: { id },
        include:{ familyMember: true}

    });
    if (!creditCard) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...creditCardData } = creditCard;
    let candidateOrResponsible = creditCard.candidate_id || creditCard.familyMember?.candidate_id || creditCard.legalResponsibleId || creditCard.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){

        const updateCreditCard = await historyDatabase.creditCard.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...creditCardData }
        });
    }
}