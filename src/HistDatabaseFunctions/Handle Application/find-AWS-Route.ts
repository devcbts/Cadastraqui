import { historyDatabase } from "@/lib/prisma";

export async function findAWSRouteHDB(candidateOrResponsible_id: string, section: string, member_id: string, table_id: string | null, application_id:string ){
    const candidateOrResponsibleHDB_id = await historyDatabase.idMapping.findFirst({
        where: {application_id, mainId: candidateOrResponsible_id},
        select: {newId: true}
    });

    const memberHDB_id = await historyDatabase.idMapping.findFirst({
        where: {application_id, mainId: member_id},
        select: {newId: true}
    });
    
    

    if (section === 'income') {
        const tableHDB_id = await historyDatabase.familyMemberIncome.findFirst({
            where: {application_id, main_id: table_id},
            select: {id:true}
        })
        return `applicationDocuments/${application_id}/${candidateOrResponsibleHDB_id?.newId}/${section}/${memberHDB_id?.newId}/${tableHDB_id?.id}/`
    }
    if (section === 'monthly-income') {
        const tableHDB_id = await historyDatabase.monthlyIncome.findFirst({
            where: {application_id, main_id: table_id},
            select: {id:true}
        })
        return `applicationDocuments/${application_id}/${candidateOrResponsibleHDB_id?.newId}/${section}/${memberHDB_id?.newId}/${tableHDB_id?.id}/`
    }
    if (section === 'vehicle') {
        const tableHDB_id = await historyDatabase.vehicle.findFirst({
            where: {application_id, main_id: table_id},
            select: {id:true}
        
        })
        return `applicationDocuments/${application_id}/${candidateOrResponsibleHDB_id?.newId}/${section}/${memberHDB_id?.newId}/${tableHDB_id?.id}/`

    }

    return `applicationDocuments/${application_id}/${candidateOrResponsibleHDB_id?.newId}/${section}/${memberHDB_id?.newId}/`
}