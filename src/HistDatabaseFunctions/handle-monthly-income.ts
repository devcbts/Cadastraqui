import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";

export async function createMonthlyIncomeHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const monthlyIncome = await prisma.monthlyIncome.findUnique({
        where: {id}
    })
    if (!monthlyIncome) {
        return null;
        
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId,candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...monthlyIncomeData } = monthlyIncome;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (candidate_id ? { candidate_id: newFamilyMemberId } : { responsible_id: newFamilyMemberId });

    const createMonthlyIncome = await historyDatabase.monthlyIncome.create({
            data: {main_id:monthlyIncome.id, ...monthlyIncomeData, ...idField, application_id }
    });
}

export async function updateMonthlyIncomeHDB(id: string) {
    const monthlyIncome = await prisma.monthlyIncome.findUnique({
        where: { id },
        include:{ familyMember: true}

    });
    if (!monthlyIncome) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...monthlyIncomeData } = monthlyIncome;
    let candidateOrResponsible = monthlyIncome.candidate_id || monthlyIncome.familyMember?.candidate_id || monthlyIncome.legalResponsibleId || monthlyIncome.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){

        const updateMonthlyIncome = await historyDatabase.monthlyIncome.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...monthlyIncomeData }
        });
    }
}
