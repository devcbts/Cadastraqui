import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getRenewCourses(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user
        const entity = await prisma.entity.findUnique({
            where: { user_id: sub },
            include: { EntitySubsidiary: { select: { id: true } } }
        })
        const studentsCourses = await prisma.student.findMany({
            where: {
                entityCourse: {
                    OR:
                        [{ entity_id: entity?.id },
                        { entitySubsidiary_id: { in: entity?.EntitySubsidiary.map(e => e.id) } }]
                }
            },
            select: { shift: true, entityCourse_id: true, entityCourse: { include: { course: true } } },
            distinct: ["entityCourse_id", "shift"]
        })
        const countStudents = await prisma.student.groupBy({
            by: ["entityCourse_id", "shift"],
            where: {
                entityCourse: {
                    OR:
                        [{ entity_id: entity?.id },
                        { entitySubsidiary_id: { in: entity?.EntitySubsidiary.map(e => e.id) } }]
                }
            },
            _count: { _all: true }
        })
        const courses = studentsCourses.map(e => ({
            id: e.entityCourse_id,
            course: e.entityCourse.course.name,
            course_id: e.entityCourse.course_id,
            shift: e.shift,
            type: e.entityCourse.course.Type,
            entity: e.entityCourse.entitySubsidiary_id ?? e.entityCourse.entity_id,
            isMatrixCourse: !!e.entityCourse.entity_id,
            current_scholarships: countStudents.find(item => item.entityCourse_id === e.entityCourse_id && e.shift === item.shift)?._count._all
        }))

        return response.status(200).send({ courses })
    } catch (err) {
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}