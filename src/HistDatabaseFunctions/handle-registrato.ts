import { historyDatabase, prisma } from "@/lib/prisma";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";

export async function createRegistratoHDB (id: string, candidate_id: string | null, legalResponsibleId : string | null, application_id: string){
    
    const familyMemberMapping = await historyDatabase.idMapping.findFirst({
        where: { mainId: (id), application_id }
    });
    const newFamilyMemberId = familyMemberMapping?.newId;
    
    const route = `CandidateDocuments/${candidate_id || legalResponsibleId || ''}/registrato/${(id)}/`;
    const RouteHDB = await findAWSRouteHDB(candidate_id || legalResponsibleId || '' , 'registrato', (newFamilyMemberId)!, '', application_id);
    await copyFilesToAnotherFolder(route, RouteHDB)

    
}