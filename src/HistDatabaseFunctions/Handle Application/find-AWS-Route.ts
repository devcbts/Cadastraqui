import { historyDatabase } from "@/lib/prisma";

// Função para encontrar o tableHDB_id ou retornar o memberHDB_id se o tableHDB_id não existir
export async function findTableHDBId(section: string, member_id: string, table_id: string | null, application_id: string) {
    let memberHDB_id;

    // Buscar o memberHDB_id se não for fornecido
    if (!table_id) {
        memberHDB_id = await historyDatabase.idMapping.findFirstOrThrow({
            where: { application_id, mainId: member_id },
            select: { newId: true }
        });
        member_id = memberHDB_id.newId;
        return member_id;
    }

    let tableHDB_id;

    if (section === 'income') {
        tableHDB_id = await historyDatabase.familyMemberIncome.findFirst({
            where: { application_id, main_id: table_id },
            select: { id: true }
        });
    } else if (section === 'monthly-income') {
        tableHDB_id = await historyDatabase.monthlyIncome.findFirst({
            where: { application_id, main_id: table_id },
            select: { id: true }
        });
    } else if (section === 'vehicle') {
        tableHDB_id = await historyDatabase.vehicle.findFirst({
            where: { application_id, main_id: table_id },
            select: { id: true }
        });
    } else if (section === 'bank') {
        tableHDB_id = await historyDatabase.bankAccount.findFirst({
            where: { application_id, main_id: table_id },
            select: { id: true }
        });
    } else if (section === 'health') {
        tableHDB_id = await historyDatabase.familyMemberDisease.findFirst({
            where: { application_id, main_id: table_id },
            select: { id: true }
        });
    } else if (section === 'medication') {
        tableHDB_id = await historyDatabase.medication.findFirst({
            where: { application_id, main_id: table_id },
            select: { id: true }
        });
    } else if (section === 'statement') {
        tableHDB_id = await historyDatabase.bankAccount.findFirst({
            where: { application_id, main_id: table_id },
            select: { id: true }
        });
    }

    return tableHDB_id ? tableHDB_id.id : member_id;
}

// Função para encontrar o caminho no AWS
export async function findAWSRouteHDB(candidateOrResponsible_id: string, section: string, member_id: string, table_id: string | null, application_id: string) {
    const memberHDB_id = await historyDatabase.idMapping.findFirstOrThrow({
        where: { application_id, mainId: member_id },
        select: { newId: true }
    });

    const tableHDB_id = await findTableHDBId(section, member_id, table_id, application_id);

    if (tableHDB_id === memberHDB_id.newId) {
        return `applicationDocuments/${application_id}/${section}/${memberHDB_id.newId}/`;
    } else {
        return `applicationDocuments/${application_id}/${section}/${memberHDB_id.newId}/${tableHDB_id}/`;
    }
}