import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "../select-candidate-responsible";

export default async function verifyIncomesCompletion(candidateOrResponsibleId:string){

    const candidateOrReponsible = await SelectCandidateResponsible(candidateOrResponsibleId);

    if (!candidateOrReponsible) {
        return null;
    }
    const idField = candidateOrReponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsibleId } : { candidate_id: candidateOrResponsibleId };
    const familyMembers = await prisma.familyMember.findMany({
        where: idField
    })

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

    if(familyMembers.some((familyMember) => !familyMember.isIncomeUpdated)){
        update = false;
    }
    if (identityDetails.isIncomeUpdated === false) {
        update = false;
        
    }

    await prisma.finishedRegistration.upsert({
        where: idField,
        update: { rendaMensal: update },
        create: {
            ...idField, rendaMensal: update
        }
    })
    
}