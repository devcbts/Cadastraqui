import { prisma } from "@/lib/prisma";

export async function ChooseCandidateResponsible(id: string): Promise<{ responsible: boolean, data: any } | null> {

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
        return { responsible: true, data: responsible };
    } else {
        return { responsible: false, data: candidate};
    }
}