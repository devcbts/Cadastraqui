import { prisma } from "@/lib/prisma";

export default async function findAllDiseases(candidate_id: string | null, legalResponsibleId: string | null) {
    let candidateOrResponsible
    if (candidate_id) {
        candidateOrResponsible = await prisma.candidate.findUnique({
            where: { id: candidate_id },
            include: { FamillyMember: true }
        })
    }
    if (legalResponsibleId) {
        candidateOrResponsible = await prisma.legalResponsible.findUnique({
            where: { id: legalResponsibleId },
            include: { FamillyMember: true }
        })
    }
    if (!candidateOrResponsible) {
        return null
    }


    const income = await prisma.familyMemberDisease.findMany({
        where: {
            OR: [
                { candidate_id: candidateOrResponsible.id },
                { legalResponsibleId: candidateOrResponsible.id },
                { familyMember_id: { in: candidateOrResponsible.FamillyMember.map(member => member.id) } }
            ]
        }
    });

    return income;
}