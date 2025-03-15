import { Candidate, IdentityDetails, LegalResponsible } from "@prisma/client";
import { prisma } from "../lib/prisma";

//This function is similar to ChooseCandidateResponsible, but it diferentiates the candidate from the responsible by the id
export async function SelectCandidateResponsible(identifier: string): Promise<{ IsResponsible: boolean, UserData: (LegalResponsible | Candidate) & { IdentityDetails: IdentityDetails } } | null> {

    const candidate = await prisma.candidate.findFirst({
        where: { OR: [{ id: identifier }, { user_id: identifier }] },
        include: { IdentityDetails: true }
    });

    const responsible = await prisma.legalResponsible.findFirst({
        where: { OR: [{ id: identifier }, { user_id: identifier }] },
        include: { IdentityDetails: true }
    });


    if (responsible) {
        return { IsResponsible: true, UserData: responsible as (LegalResponsible & { IdentityDetails: IdentityDetails }) };
    }
    if (candidate) {

        return { IsResponsible: false, UserData: candidate as (Candidate & { IdentityDetails: IdentityDetails }) };
    }
    return null;
}
