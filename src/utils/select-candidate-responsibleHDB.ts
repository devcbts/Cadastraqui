import { historyDatabase } from "@/lib/prisma";

//This function is similar to ChooseCandidateResponsible, but it diferentiates the candidate from the responsible by the id
export async function SelectCandidateResponsibleHDB(identifier: string): Promise<{ IsResponsible: boolean, UserData: any } | null> {

    const [candidate, responsible] = await historyDatabase.$transaction([
        historyDatabase.candidate.findFirst({
            where: { OR: [{ id: identifier }, { application_id: identifier }] },
        }),
        historyDatabase.legalResponsible.findFirst({
            where: { OR: [{ id: identifier }, { application_id: identifier }] },
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
