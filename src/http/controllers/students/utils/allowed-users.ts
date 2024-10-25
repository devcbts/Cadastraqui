import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@prisma/client";

export default async function allowedUsersStudentRoutes(sub: string, role: keyof typeof ROLE) {
    // find users that might be one of "ASSISTANT","ENTITY","ENTITY_DIRECTOR"
    let user;
    let user_id;
    switch (role) {
        case "ASSISTANT":
            user = await prisma.socialAssistant.findUnique({
                where: { user_id: sub },
                select: { entity: { select: { user_id: true } } }

            })
            user_id = user?.entity.user_id
            break
        case "ENTITY":
            user = await prisma.entity.findUnique({
                where: { user_id: sub },
            })
            user_id = user?.user_id
            break

        case "ENTITY_DIRECTOR":
            user = await prisma.entityDirector.findUnique({
                where: { user_id: sub },
                select: { entity: { select: { user_id: true } } }
            })
            user_id = user?.entity.user_id
            break
        default:
            throw new APIError('Usuário não permitido')
    }
    if (!user || !user_id) {
        throw new APIError('Usuário não encontrado')
    }
    return { user_id }

}