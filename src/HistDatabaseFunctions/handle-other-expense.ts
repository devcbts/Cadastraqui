import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";

export async function createOtherExpenseHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const otherExpense = await prisma.otherExpense.findUnique({
        where: {id}
    })
    if (!otherExpense) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId,candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...otherExpenseData } = otherExpense;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (candidate_id ? { candidate_id: candidate_id } : { responsible_id: legalResponsibleId });

    const createOtherExpense = await historyDatabase.otherExpense.create({
            data: {main_id:id, ...otherExpenseData, ...idField, application_id }
    });
}

export async function updateOtherExpenseHDB(id: string) {
    const otherExpense = await prisma.otherExpense.findUnique({
        where: { id },
        include:{ familyMember: true}

    });
    if (!otherExpense) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...otherExpenseData } = otherExpense;
    let candidateOrResponsible = otherExpense.candidate_id || otherExpense.familyMember?.candidate_id || otherExpense.legalResponsibleId || otherExpense.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){

        const updateOtherExpense = await historyDatabase.otherExpense.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...otherExpenseData }
        });
    }
}