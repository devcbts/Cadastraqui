import { prisma } from "@/lib/prisma";
import { DocumentSectionEnum } from "../enums/document_section";

export default async function getCandidateDocument(tableName:  DocumentSectionEnum, tableId: string) {
    return await prisma.candidateDocuments.findMany({
        where: {
            tableName: tableName.toString(),
            tableId
        }
    })

}