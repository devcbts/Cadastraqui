import { prisma } from "@/lib/prisma";
import { ROLE } from 'prisma/prisma-client';
export async function getUserEntity(userId: string, role: ROLE) {
    let entityId;

    switch (role) {
        case 'ENTITY':
            const entity = await prisma.entity.findUnique({
                where: { user_id: userId }
            });
            entityId = entity?.id
            break;
        case 'ENTITY_DIRECTOR':
            const director = await prisma.entityDirector.findUnique({
                where: { user_id: userId },
            });
            entityId = director?.entity_id
            break;
        case 'LAWYER':
            const lawyer = await prisma.lawyer.findUnique({
                where: { user_id: userId },
            });
            entityId = lawyer?.entity_id
            break;
    }

    return entityId

}