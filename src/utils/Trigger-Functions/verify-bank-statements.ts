import { prisma } from "@/lib/prisma";

export default async function verifyBankStatement(id: string) {

    const bankStatements = await prisma.candidateDocuments.count({
        where: {
            tableName: 'statement',
            tableId: id
        }
    })
    let update = false
    console.log('RODEI AQUII')
    if (bankStatements >= 3) {
        update = true;
    }
    const bankAccount = await prisma.bankAccount.findUnique({
        where: {
            id
        },

    })
    if (!bankAccount) {
        return
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