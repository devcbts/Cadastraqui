import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";

export async function createMedicationHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    const medication = await prisma.medication.findUnique({
        where: {id}
    })
    if (!medication) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId,candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId, familyMemberDiseaseId: oldDiseaseId, ...medicationData } = medication;
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, application_id }
    });
    let diseaseMapping
    if (oldDiseaseId) {
        
        diseaseMapping = await historyDatabase.idMapping.findFirst({
            where: { mainId: oldDiseaseId!, application_id }
        })
    }

    const newFamilyMemberId = familyMemberMapping?.newId;
    const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : (candidate_id ? { candidate_id: newFamilyMemberId } : { responsible_id: newFamilyMemberId });

    const createMedication = await historyDatabase.medication.create({
            data: {main_id:id, ...medicationData, ...idField, application_id, familyMemberDiseaseId: diseaseMapping?.newId }
    });
    const route = `CandidateDocuments/${candidate_id || legalResponsibleId || ''}/medication/${(oldFamilyMemberId || oldCandidateId || oldResponsibleId || '')}/${medication.id}/`;
    const RouteHDB = await findAWSRouteHDB(candidate_id || legalResponsibleId || '' , 'medication', (oldFamilyMemberId || oldCandidateId || oldResponsibleId)!, medication.id, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB)

    
    
}

export async function updateMedicationHDB(id: string) {
    const medication = await prisma.medication.findUnique({
        where: { id },
        include:{ familyMember: true}

    });
    if (!medication) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...medicationData } = medication;
    let candidateOrResponsible = medication.candidate_id || medication.familyMember?.candidate_id || medication.legalResponsibleId || medication.familyMember?.legalResponsibleId
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){
        const {familyMember: none ,...dataToSend} =medicationData
        const updateMedication = await historyDatabase.medication.updateMany({
            where: { main_id: id, application_id: application.id },
            data: { ...dataToSend }
        });
    }
}

export async function deleteMedicationHDB(id: string) {
    const medication = await prisma.medication.findUnique({
        where: { id },
        include: { familyMember: true }
    });
    if (!medication) {
        return null;
    }
    const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, legalResponsibleId: oldResponsibleId,  ...medicationData } = medication;
    let candidateOrResponsible = medication.candidate_id || medication.familyMember?.candidate_id || medication.legalResponsibleId || medication.familyMember?.legalResponsibleId;
    if (!candidateOrResponsible) {
        return null;
    }
    const openApplications = await getOpenApplications(candidateOrResponsible);
    if (!openApplications) {
        return null;
    }
    for(const application of openApplications){
        const deleteMedication = await historyDatabase.medication.deleteMany({
            where: { main_id: id, application_id: application.id }
        });
    }
}