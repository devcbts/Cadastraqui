import { prisma } from "@/lib/prisma";

export default async function verifyBankStatement(id:string){

    const bankStatements = await prisma.candidateDocuments.count({
        where: {
            tableName: 'statement',
            tableId: id
        }
    })
    let update = false
    if (bankStatements >= 3) {
        update =true;
    }
    await prisma.bankAccount.update({
        where: {
            id
        },
        data: {
            isUpdated: update
        }
    })
    
}