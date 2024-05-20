import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";

export async function createExpenseHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const expense = await prisma.expense.findUnique({
        where: {id}
    })
    if (!expense) {
        return null;
    }
    const { id: oldId,candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...expenseData } = expense;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: ( oldCandidateId || oldResponsibleId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = (candidate_id ? { candidate_id: newFamilyMemberId } : { responsible_id: newFamilyMemberId });

    const createExpense = await historyDatabase.expense.create({
            data: {main_id:id, ...expenseData, ...idField, application_id }
    });
}

export async function updateExpenseHDB(id: string) {
    const expense = await prisma.expense.findUnique({
        where: { id },
       
    });
    if (!expense) {
        return null;
    }
    const { id: oldId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...expenseData } = expense;
    let candidateOrResponsible = expense.candidate_id  || expense.legalResponsibleId 
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){

        const updateExpense = await historyDatabase.expense.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...expenseData }
        });
    }
}