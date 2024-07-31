import { getSectionDocumentsPDF } from "@/http/controllers/candidates/AWS Routes/get-pdf-documents-by-section";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "../select-candidate-responsible";
import { ForbiddenError } from "@/errors/forbidden-error";
import { calculateAge } from '../calculate-age';

export default async function verifyDeclarationRegistration(candidateOrResponsibleId: string) {

    const candidateOrResponsible = await SelectCandidateResponsible(candidateOrResponsibleId);
    if (!candidateOrResponsible) {
        throw new ForbiddenError()
    }
    const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsibleId } : { candidate_id: candidateOrResponsibleId }
    const candidates = await prisma.candidate.findMany({
        where: {responsible_id: candidateOrResponsible.UserData.id},
    })
    

   
    let update = true;
    for (const candidate of candidates) {
        const route = `declaracoes/${candidate.id}`;
        const findDeclaration = await getSectionDocumentsPDF(candidateOrResponsibleId, route)
        if (!findDeclaration || Object.keys(findDeclaration).length === 0) {
            update = false;
            break;
        }
    }

    await prisma.finishedRegistration.upsert({
        where:idField,
        update: { declaracoes: update },
        create: {
           ...idField, declaracoes: update
        }
    })
}