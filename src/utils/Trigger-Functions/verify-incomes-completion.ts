import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "../select-candidate-responsible";
import { DocumentAnalysisStatus } from "@prisma/client";

export default async function verifyIncomesCompletion(candidateOrResponsibleId: string) {

    const candidateOrReponsible = await SelectCandidateResponsible(candidateOrResponsibleId);

    if (!candidateOrReponsible) {
        return null;
    }
    const idField = candidateOrReponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsibleId } : { candidate_id: candidateOrResponsibleId };
    const familyMembers = await prisma.familyMember.findMany({
        where: idField
    })
    let updatedStatus: DocumentAnalysisStatus = 'Approved'

    const identityDetails = await prisma.identityDetails.findFirst({
        where: {
            OR: [
                { candidate_id: candidateOrResponsibleId },
                { responsible_id: candidateOrResponsibleId }
            ]
        }
    });

    if (!identityDetails) {
        return null;
    }
    let update = true

    if (familyMembers.some((familyMember) => familyMember.incomeUpdatedStatus === 'Forced')) updatedStatus = 'Forced'


    if (identityDetails.incomeUpdatedStatus === 'Forced') updatedStatus = 'Forced'

    if (familyMembers.some((familyMember) => !familyMember.isIncomeUpdated || familyMember.isIncomeUpdated === null)) update = false;

    if (identityDetails.isIncomeUpdated === false || identityDetails.isIncomeUpdated === null) update = false;


    if (identityDetails.incomeUpdatedStatus === 'Declined') updatedStatus = 'Declined'
    if (familyMembers.some((familyMember) => familyMember.incomeUpdatedStatus === 'Declined')) updatedStatus = 'Declined'



    await prisma.finishedRegistration.upsert({
        where: idField,
        update: { rendaMensal: update },
        create: {
            ...idField, rendaMensal: update,
            rendaMensalStatus: updatedStatus
        }
    })

}