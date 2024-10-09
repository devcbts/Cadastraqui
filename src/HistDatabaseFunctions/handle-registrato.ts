import { historyDatabase, prisma } from "@/lib/prisma";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";
import { createCandidateDocumentHDB } from "./Handle Documents/handle-candidate-document";
import getCandidateDocument from "@/http/controllers/candidates/Documents Functions/get-candidate-document";

export async function createRegistratoHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (id), application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    
    const route = `CandidateDocuments/${candidate_id || legalResponsibleId || ''}/registrato/${id}/`;
    const RouteHDB = await findAWSRouteHDB(legalResponsibleId || candidate_id || '' , 'registrato', id, '', application_id);
    const copyFiles = await getCandidateDocument("registrato", id);
    await historyDatabase.$transaction(async (tsPrismaHDB) => {
        for (const file of copyFiles) {
            const metadata = file.metadata ?? {}; // Provide a default value if metadata is null

            await createCandidateDocumentHDB(tsPrismaHDB, RouteHDB, route, metadata, 'registrato', id, null, application_id);
        }
    })
    await copyFilesToAnotherFolder(route, RouteHDB)

    
}