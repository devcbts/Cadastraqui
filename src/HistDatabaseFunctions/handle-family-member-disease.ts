import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";
import { verifyHealthRegistration } from "@/utils/Trigger-Functions/verify-health-registration";

export async function createFamilyMemberDiseaseHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const familyMemberDisease = await prisma.familyMemberDisease.findUnique({
        where: {id}
    })
    if (!familyMemberDisease) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId,candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, ...familyMemberDiseaseData } = familyMemberDisease;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (familyMemberDisease.legalResponsibleId ?  { legalResponsibleId: newFamilyMemberId } : { candidate_id: newFamilyMemberId } );

    const createFamilyMemberDisease = await historyDatabase.familyMemberDisease.create({
            data: {main_id:id, ...familyMemberDiseaseData, ...idField, application_id }
    });
    await historyDatabase.idMapping.create({
        data: { mainId: id, newId: createFamilyMemberDisease.id, application_id }
    });
    const idRoute = legalResponsibleId ? legalResponsibleId : candidate_id;
    if (!idRoute) {
        return null;
    }
    const route = `CandidateDocuments/${idRoute}/health/${(oldFamilyMemberId || oldCandidateId || oldResponsibleId || '')}/${familyMemberDisease.id}/`;
    const RouteHDB = await findAWSRouteHDB(idRoute , 'health', (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, familyMemberDisease.id, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB)

}

export async function updateFamilyMemberDiseaseHDB(id: string) {
    const familyMemberDisease = await prisma.familyMemberDisease.findUnique({
        where: { id },
        include:{ familyMember: true}

    });
    if (!familyMemberDisease) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...familyMemberDiseaseData } = familyMemberDisease;
    let candidateOrResponsible = familyMemberDisease.candidate_id || familyMemberDisease.familyMember?.candidate_id || familyMemberDisease.legalResponsibleId || familyMemberDisease.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){
        const {familyMember: none ,...dataToSend} =familyMemberDiseaseData
        const updateFamilyMemberDisease = await historyDatabase.familyMemberDisease.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...dataToSend }
        });
    }
}

export async function deleteFamilyMemberDiseaseHDB(id: string, memberId: string) {
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
        const deleteFamilyMemberDisease = await historyDatabase.familyMemberDisease.deleteMany({
            where: { main_id: id, application_id: application.id }
        });
    }
    await verifyHealthRegistration(candidateOrResponsibleId)

}