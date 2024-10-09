import nodeSchedule from 'node-schedule';
import { historyDatabase, prisma } from '../lib/prisma';
import { deleteFromS3 } from '@/lib/S3';

async function removeOutdatedDocuments() {
    const processedDocuments: any[] = []; // Passo 1
    try {
        const expiredDocuments = await prisma.candidateDocuments.findMany({
            where: {
                expiresAt: {
                    lt: new Date() // Considera documentos com data de expiração menor que a data atual
                }
            }
        });

        for (const document of expiredDocuments) {

            if (document.tableName === "statement") {
                // Atualizar o status das declarações

                await prisma.$transaction(async (tsPrisma) => {

                    await tsPrisma.candidateDocuments.delete({
                        where: {
                            id: document.id
                        }
                    });
                    await tsPrisma.bankAccount.update({
                        where: {
                            id: document.tableId
                        },
                        data: {
                            isUpdated: false
                        }
                    });

                    await deleteFromS3(document.path);
                    await historyDatabase.$transaction(async (tsBackupPrisma) => {
                        await tsBackupPrisma.candidateDocuments.deleteMany({
                            where: {
                                pathInMainDatabase: document.path
                            }
                        })
                        await tsBackupPrisma.bankAccount.updateMany({
                            where: {
                                main_id: document.tableId
                            },
                            data: {
                                isUpdated: false
                            }
                        });

                    })
                })
            }

            if (document.tableName === "pix" || document.tableName === "registrato") {
                // Atualizar o status dos documentos bancários
                await prisma.candidateDocuments.update({
                    where: {
                        id: document.id
                    },
                    data: {
                        status: "PENDING"
                    }
                });
            }

        }
    }
    catch (err) {
        // Handle error
        console.error("Erro ao remover documentos vencidos:", err);
    }
    return processedDocuments; // Passo 3
}

// Executa todo dia 1 do mês às 3 AM
const RemoveOutdatedDocuments: nodeSchedule.Job = nodeSchedule.scheduleJob("0 0 2 1 * *", async () => {
    const processedDocuments = await removeOutdatedDocuments();
    console.log(`${processedDocuments.length} documentos vencidos foram processados.`);
});

export default RemoveOutdatedDocuments;