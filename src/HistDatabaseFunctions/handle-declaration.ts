
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder } from "@/lib/S3";

// id = id of familyMember / Candidate / Responsible
export async function createDeclarationHDB (id: string, candidateOrResponsibleId: string, application_id: string){
    
    
    const route = `CandidateDocuments/${candidateOrResponsibleId}/declaracoes/${id}/`;
    const RouteHDB = await findAWSRouteHDB(candidateOrResponsibleId , 'declaracoes', id , null, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB)

}