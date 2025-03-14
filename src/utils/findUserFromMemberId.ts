import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "./select-candidate-responsible";

export default async function findUserFromMemberId(memberId: string) {
    try {
        const candidateOrResponsible = await SelectCandidateResponsible(memberId);
        if (candidateOrResponsible && candidateOrResponsible.UserData) {
            return { id: candidateOrResponsible.UserData.id, isResponsible: candidateOrResponsible.IsResponsible };
        }
        else {
            const familyMember = await prisma.familyMember.findUnique({
                where: {
                    id: memberId
                }
            })
            if (familyMember) {
                return {
                    id: (familyMember.legalResponsibleId || familyMember.candidate_id)!,
                     isResponsible: !!familyMember.legalResponsibleId
                };
            }
            return null;
        }
    } catch (error) {
        throw error;
    }
}