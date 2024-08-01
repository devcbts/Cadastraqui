import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "../select-candidate-responsible";

export async function verifyHealthRegistration(CandidateOrResponsibleId: string) {
    const candidateOrResponsible = await SelectCandidateResponsible(CandidateOrResponsibleId); // Verifica se o usuário é um candidato ou responsável
    if (!candidateOrResponsible) {
        return null;

    }
    const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id };
    const familyMembers = await prisma.familyMember.findMany({
        where: {
            ...idField,
            hasSevereDeseaseOrUsesMedication: true
        }
    });
    const identityDetails = await prisma.identityDetails.findFirst({
        where: {OR: [
            { candidate_id: candidateOrResponsible.UserData.id },
            { responsible_id: candidateOrResponsible.UserData.id }
        
        ]}
    })
    if (!identityDetails) {
        return null;

    }

    let update = true;

    familyMembers.forEach(async familyMember => {

        const hasData = await prisma.$transaction([
            prisma.familyMemberDisease.findFirst({
                where: {
                    familyMember_id: familyMember.id
                }
            }),
            prisma.medication.findFirst({
                where: {
                    familyMember_id: familyMember.id
                }
            })
        ]);
        // Se não houver nenhum registro para o familiar, o registro de saúde não estará completo
        if (!hasData[0] || !hasData[1]) {
            update = false;
            
        }
    });
    // Se o usuário declara que ele possui uma doença severa ou usa medicamento controlado, então a verificação também é valida para ele
    if (identityDetails.hasSevereDeseaseOrUsesMedication) {
        const hasData = await prisma.$transaction([
            prisma.familyMemberDisease.findFirst({
                where: {
                    ...idField
                }
            }),
            prisma.medication.findFirst({
                where: {
                    ...idField
                }
            })
        ]);
        if (!hasData[0] || !hasData[1]) {
            update = false;
            
        }
        
    }
    if (identityDetails.hasSevereDeseaseOrUsesMedication === null) {
        update = false;
    }

    familyMembers.forEach(familyMember => {
        if (familyMember.hasSevereDeseaseOrUsesMedication === null) {
            update = false;
        }
    });

    await prisma.finishedRegistration.upsert({
        where: idField,
        create: { saude: update, ...idField },
        update: {
          saude: update,
        }
      })



}