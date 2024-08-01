import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "../select-candidate-responsible";

export async function verifyIncomeBankRegistration(CandidateOrResponsibleId: string) {
    const candidateOrResponsible = await SelectCandidateResponsible(CandidateOrResponsibleId);
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
        where: {OR: [
            { candidate_id: candidateOrResponsible.UserData.id },
            { responsible_id: candidateOrResponsible.UserData.id }
        ]}
    })
    if (!identityDetails) {
        return null;
    }

    let update = true;

    for (const familyMember of familyMembers) {
        const hasIncome = await prisma.familyMemberIncome.findFirst({
            where: {
                familyMember_id: familyMember.id
            }
        });
        if (!hasIncome) {
            update = false;
        }

        if (familyMember.hasBankAccount) {
            const hasBankAccount = await prisma.bankAccount.findFirst({
                where: {
                    familyMember_id: familyMember.id
                }
            });
            if (!hasBankAccount) {
                update = false;
            }
        }

       
    }

    const hasIncome = await prisma.familyMemberIncome.findFirst({
        where: {
           ...idField
        }
    });
    if (!hasIncome) {
        update = false;
    }

    if (identityDetails.hasBankAccount) {
        const hasBankAccount = await prisma.bankAccount.findFirst({
            where: {
                ...idField
            }
        });
        if (!hasBankAccount) {
            update = false;
        }
    }
    if (identityDetails.hasBankAccount === null) {
        update = false;
    }

    familyMembers.forEach(familyMember => {
        if (familyMember.hasBankAccount === null) {
            update = false;
        }
    });
    await prisma.finishedRegistration.upsert({
        where: idField,
        create: { rendaMensal: update, ...idField },
        update: {
          rendaMensal: update,
        }
    });
}