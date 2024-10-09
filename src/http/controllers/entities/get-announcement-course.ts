import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import SelectEntityOrDirector from "./utils/select-entity-or-director";

export default async function getAnnouncementCourse(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        education_level_id: z.string()
    })
    try {
        const { education_level_id } = schema.parse(request.params)
        const { sub, role } = request.user
        const entity = await SelectEntityOrDirector(sub, role)
        if (!entity) {
            throw new Error('Entidade não encontrada')
        }
        const course = await prisma.educationLevel.findUnique({
            where: { id: education_level_id },
            include: {
                course: true,
                entitySubsidiary: true
            }
        })
        return response.status(200).send({ course: { ...course, entity: course?.entitySubsidiaryId ? course.entitySubsidiary : entity } })
    } catch (err) {
        return response.status(400).send({ message: 'Erro durante a busca do curso especificado' })
    }
}