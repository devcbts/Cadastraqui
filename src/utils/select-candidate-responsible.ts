import { prisma } from "../lib/prisma";

//This function is similar to ChooseCandidateResponsible, but it diferentiates the candidate from the responsible by the id
export async function SelectCandidateResponsible(identifier: string): Promise<{ IsResponsible: boolean, UserData: any } | null> {

    const [candidate, responsible] = await prisma.$transaction([
        prisma.candidate.findFirst({
            where: { OR: [{ id: identifier }, { user_id: identifier }] },
        }),
        prisma.legalResponsible.findFirst({
            where: { OR: [{ id: identifier }, { user_id: identifier }] },
        })
    ])

    if (!candidate && !responsible) {
        return null;
    }

    if (responsible) {
        return { IsResponsible: true, UserData: responsible };
    }
    return { IsResponsible: false, UserData: candidate };
}
