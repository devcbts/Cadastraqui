import { Candidate, LegalResponsible } from "@prisma/client";
import { prisma } from "../lib/prisma";

//This function is similar to ChooseCandidateResponsible, but it diferentiates the candidate from the responsible by the id
export async function SelectCandidateResponsible(identifier: string): Promise<{ IsResponsible: boolean, UserData: LegalResponsible | Candidate } | null> {

    const candidate = await prisma.candidate.findFirst({
        where: { OR: [{ id: identifier }, { user_id: identifier }] },
    });

    const responsible = await prisma.legalResponsible.findFirst({
        where: { OR: [{ id: identifier }, { user_id: identifier }] },
    });


    if (responsible) {
        return { IsResponsible: true, UserData: responsible as LegalResponsible };
    }
    if(candidate){

        return { IsResponsible: false, UserData: candidate as Candidate };
    }
    return null;
}
