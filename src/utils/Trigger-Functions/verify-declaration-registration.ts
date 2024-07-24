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
    const familyMembers = await prisma.familyMember.findMany({
        where: idField,
        select: {birthDate: true, id: true, legalResponsibleId: true}
    })
    

    const familyMemberIds = familyMembers
    .filter(familyMember => calculateAge(new Date(familyMember.birthDate)) < 18 && familyMember.legalResponsibleId != null)
    .map(familyMember => familyMember.id);
    familyMemberIds.push(candidateOrResponsibleId);

    let update = true;
    for (const familyMemberId of familyMemberIds) {
        const route = `declaracoes/${familyMemberId}`;
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