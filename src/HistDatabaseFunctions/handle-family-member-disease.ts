import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";

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
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (candidate_id ? { candidate_id: newFamilyMemberId } : { responsible_id: newFamilyMemberId });

    const createFamilyMemberDisease = await historyDatabase.familyMemberDisease.create({
            data: {main_id:id, ...familyMemberDiseaseData, ...idField, application_id }
    });
    const route = `CandidateDocuments/${candidate_id || legalResponsibleId || ''}/health/${(oldFamilyMemberId || oldCandidateId || oldResponsibleId || '')}/${familyMemberDisease.id}/`;
    const RouteHDB = await findAWSRouteHDB(candidate_id || legalResponsibleId || '' , 'health', (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, familyMemberDisease.id, application_id);
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

        const updateFamilyMemberDisease = await historyDatabase.familyMemberDisease.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...familyMemberDiseaseData }
        });
    }
}