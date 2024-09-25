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
        }
    });
    const identityDetails = await prisma.identityDetails.findFirst({
        where: {
            OR: [
                { candidate_id: candidateOrResponsible.UserData.id },
                { responsible_id: candidateOrResponsible.UserData.id }

            ]
        }
    })
    if (!identityDetails) {
        return null;

    }

    let update = true;

    for (const familyMember of familyMembers) {

        if (familyMember.hasSevereDeseaseOrUsesMedication) {

            const { disease, medication } = await prisma.$transaction(async (tsPrisma) => {
                const disease = tsPrisma.familyMemberDisease.findFirst({
                    where: {
                        familyMember_id: familyMember.id
                    }
                })
                const medication = tsPrisma.medication.findFirst({
                    where: {
                        familyMember_id: familyMember.id
                    }
                })
                return { disease, medication }
            });
            // Se não houver nenhum registro para o familiar, o registro de saúde não estará completo
            if (!disease && !medication) {
                update = false;

            }
        }
        ;
    }
    // Se o usuário declara que ele possui uma doença severa ou usa medicamento controlado, então a verificação também é valida para ele
    if (identityDetails.hasSevereDeseaseOrUsesMedication) {
        const { disease, medication } = await prisma.$transaction(async (tsPrisma) => {
            const disease = tsPrisma.familyMemberDisease.findFirst({
                where: {
                    ...idField
                }
            })
            const medication = tsPrisma.medication.findFirst({
                where: {
                    ...idField
                }
            })
            return { disease, medication }
        });
        // Se não houver nenhum registro para o familiar, o registro de saúde não estará completo
        if (!disease && !medication) {
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