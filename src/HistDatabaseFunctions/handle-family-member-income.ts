import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";

export async function createFamilyMemberIncomeHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const familyMemberIncome = await prisma.familyMemberIncome.findUnique({
        where: {id}
    })
    if (!familyMemberIncome) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...familyMemberIncomeData } = familyMemberIncome;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    console.log(familyMemberMapping)
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (familyMemberIncome.candidate_id ? { candidate_id: newFamilyMemberId } : { legalResponsibleId: newFamilyMemberId });
    const createFamilyMemberIncome = await historyDatabase.familyMemberIncome.create({
            data: {main_id:id, ...familyMemberIncomeData, ...idField, application_id }
    });
    const idRoute = legalResponsibleId ? legalResponsibleId : candidate_id;
    if (!idRoute) {
        return null;
    }
    const route = `CandidateDocuments/${idRoute}/income/${(oldFamilyMemberId || oldCandidateId || oldResponsibleId || '')}/${familyMemberIncome.id}/`;
    const RouteHDB = await findAWSRouteHDB(idRoute , 'income', (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, familyMemberIncome.id, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB)

    
}

export async function updateFamilyMemberIncomeHDB(id: string) {
    const familyMemberIncome = await prisma.familyMemberIncome.findUnique({
        where: { id },
        include:{ familyMember: true}

    });
    if (!familyMemberIncome) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...familyMemberIncomeData } = familyMemberIncome;
    let candidateOrResponsible = familyMemberIncome.candidate_id || familyMemberIncome.familyMember?.candidate_id || familyMemberIncome.legalResponsibleId || familyMemberIncome.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){
        const {familyMember: none ,...dataToSend} =familyMemberIncomeData 
        const updateFamilyMemberIncome = await historyDatabase.familyMemberIncome.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...dataToSend }
        });
    }
}

export async function deleteFamilyMemberIncomeHDB(id: string, memberId: string) {
    const member = await prisma.familyMember.findUnique({
        where: { id: memberId }
    })
    const deletedMember = member ? '' : await prisma.deletedFamilyMembers.findUnique({
        where: { familyMember_id: memberId }
    })
    let candidateOrResponsibleId;

    if (member) {
        candidateOrResponsibleId = member.candidate_id || member.legalResponsibleId;
    }
    
    if (!candidateOrResponsibleId && deletedMember) {
        candidateOrResponsibleId = (deletedMember as { id: string; familyMember_id: string; candidateOrResponsibleId: string; }).candidateOrResponsibleId;
    }
    
    if (!candidateOrResponsibleId) {
        candidateOrResponsibleId = memberId;
    }    const openApplications = await getOpenApplications(candidateOrResponsibleId);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){
        const deleteFamilyMemberIncome = await historyDatabase.familyMemberIncome.deleteMany({
            where: { main_id: id, application_id: application.id }
        });
    }
}