import { prisma } from "../lib/prisma";

const updateDocStatus = async () => {
    const currentDate = new Date();
    const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    await prisma.candidateDocuments.updateMany({
        where: {
            AND: [{
                tableName: { in: ["registrato", "pix", "statement", "monthly-income"] },
                createdAt: { lt: firstDayOfCurrentMonth }
            }]
        },
        data: {
            status: "PENDING"
        }
    })
}
updateDocStatus()