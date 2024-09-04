import { ForbiddenError } from "@/errors/forbidden-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@prisma/client";


interface SelectEntityOrDirectorOptions {
    includeUser?: boolean;
}

export default async function SelectEntityOrDirector(user_id: string, role: ROLE, options: SelectEntityOrDirectorOptions = {}
) {

    if (role === 'ENTITY') {
        const entity = await prisma.entity.findUnique({
            where: { user_id },
            include: {
                user: options.includeUser ? true : false,
                EntitySubsidiary: true
            }
        })
        if (!entity) {
            throw new ForbiddenError()
        }
        return entity
    } else if (role === 'ENTITY_DIRECTOR') {
        const director = await prisma.entityDirector.findUnique({
            where: { user_id },
            include: {
                entity: {
                    include: {

                        user: options.includeUser ? true : false
                    }
                }
            }
        })
        if (!director) {
            throw new ForbiddenError()
        }
        return director.entity
    } else {
        throw new NotAllowedError()
    }
}