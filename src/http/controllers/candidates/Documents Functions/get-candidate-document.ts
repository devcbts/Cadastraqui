import { prisma } from "@/lib/prisma";
import { section } from "../AWS Routes/upload-documents";

export default async function getCandidateDocument(tableName:  typeof section, tableId: string) {
    return await prisma.candidateDocuments.findMany({
        where: {
            tableName: tableName.toString(),
            tableId
        }
    })

}