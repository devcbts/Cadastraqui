import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";

export async function createLoanHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const loan = await prisma.loan.findUnique({
        where: {id}
    })
    if (!loan) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId,candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...loanData } = loan;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (candidate_id ? { candidate_id: newFamilyMemberId } : { responsible_id: newFamilyMemberId });

    const createLoan = await historyDatabase.loan.create({
            data: {main_id:id, ...loanData, ...idField, application_id }
    });
}

export async function updateLoanHDB(id: string) {
    const loan = await prisma.loan.findUnique({
        where: { id },
        include:{ familyMember: true}

    });
    if (!loan) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...loanData } = loan;
    let candidateOrResponsible = loan.candidate_id || loan.familyMember?.candidate_id || loan.legalResponsibleId || loan.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){

        const updateLoan = await historyDatabase.loan.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...loanData }
        });
    }
}