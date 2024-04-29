import { prisma } from "@/lib/prisma";


// This function is similar to SelectCandidateResponsible, but it diferentiates the candidate (user) from the legal dependent (non-user)
export async function ChooseCandidateResponsible(id: string): Promise<{ IsResponsible: boolean, UserData: any } | null> {

    const candidate = await prisma.candidate.findUnique({
        where: {id},
        include: {
            responsible: true
        }
    })

    if (!candidate) {
        return null;
    }

    const responsible = candidate.responsible;
    if (responsible) {
        return { IsResponsible: true, UserData: responsible };
    } else {
        return { IsResponsible: false, UserData: candidate};
    }
}