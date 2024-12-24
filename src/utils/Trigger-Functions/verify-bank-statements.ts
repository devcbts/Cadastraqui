import { prisma } from "@/lib/prisma";

export default async function verifyBankStatement(id: string) {

    const bankStatements = await prisma.candidateDocuments.count({
        where: {
            tableName: 'statement',
            tableId: id
        }
    })
    let update = false

    const bankAccount = await prisma.bankAccount.findUnique({
        where: {
            id
        },include:{
            balances:true
        }

    })
    if (!bankAccount) {
        return
    }
    if (bankStatements >= 3 && bankAccount.balances.length >= 3) {
        update = true;
    }
    if (bankAccount.isUpdated === update) {
        return
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