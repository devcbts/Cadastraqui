import { prisma } from "@/lib/prisma";

export async function searchSevereDisease(candidateOrResponsible_id: string) {
    const familyMembers = await prisma.familyMember.findMany({
        where: { OR: [{ candidate_id: candidateOrResponsible_id }, { legalResponsibleId: candidateOrResponsible_id }] },
    });

    const familyDiseases = await prisma.familyMemberDisease.findMany({
        where: {
            OR: [
                { candidate_id: candidateOrResponsible_id },
                { legalResponsibleId: candidateOrResponsible_id },
                { familyMember_id: { in: familyMembers.map(member => member.id) } }
            ]
        },
    });

    if (familyDiseases.length === 0) {
        return false;
        
    }
    return true;
    }
