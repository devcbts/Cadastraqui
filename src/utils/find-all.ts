import { prisma } from "@/lib/prisma";
export default async function findAll(candidate_id: string | null, legalResponsibleId: string | null) {
    let candidateOrResponsible
    if (candidate_id) {
        candidateOrResponsible = await prisma.candidate.findUnique({
            where: { id: candidate_id },
        })
    }
    if (legalResponsibleId) {
        candidateOrResponsible = await prisma.legalResponsible.findUnique({
            where: { id: legalResponsibleId },
            select: {id: true, name: true, FamillyMember: true}
        })
    }
    if (!candidateOrResponsible) {
        return null
    }


    const familyMembers = await prisma.familyMember.findMany({
        where: {
            OR: [
                { candidate_id: candidateOrResponsible.id },
                { legalResponsibleId: candidateOrResponsible.id },
            ]
        },
        select: {id: true, fullName: true}
    });

    return {...candidateOrResponsible, familyMembers};
}