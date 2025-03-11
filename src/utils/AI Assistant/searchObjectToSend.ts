import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function searchObjectToSend({ tableId, tableName, metadata }: { tableId: string, tableName: string, metadata: Prisma.JsonObject }) {
    let objectToSend = {};

    if (metadata) {

        if (tableName === 'identity') {
            const type = metadata.type as string
            switch (type) {
                case 'ID':
                    const identityInfo = await prisma.identityDetails.findUniqueOrThrow({
                        where: {
                            id: tableId
                        }
                    })
                    objectToSend = {
                        type: 'ID',
                        name: identityInfo.fullName,
                        cpf: identityInfo.CPF,
                        birthDate: identityInfo.birthDate,
                   
                    }

            }

        }
    }
    return objectToSend;
}