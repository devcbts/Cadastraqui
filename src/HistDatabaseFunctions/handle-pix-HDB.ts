import { historyDatabase, prisma } from "@/lib/prisma";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";
import { createCandidateDocumentHDB } from "./Handle Documents/handle-candidate-document";
import getCandidateDocument from "@/http/controllers/candidates/Documents Functions/get-candidate-document";

export async function CreatePixHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (id), application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    
    const route = `CandidateDocuments/${candidate_id || legalResponsibleId || ''}/pix/${id}/`;
    const RouteHDB = await findAWSRouteHDB(legalResponsibleId || candidate_id || '', 'pix', id, '', application_id);
    const copyFiles = await getCandidateDocument("pix", id);
    
    await historyDatabase.$transaction(async (tsPrismaHDB) => {
        for (const file of copyFiles) {
            const metadata = file.metadata ?? {}; // Provide a default value if metadata is null

            await createCandidateDocumentHDB(tsPrismaHDB, RouteHDB, route, metadata, 'pix', id, null, application_id);
        }
    });
    
    await copyFilesToAnotherFolder(route, RouteHDB);
}