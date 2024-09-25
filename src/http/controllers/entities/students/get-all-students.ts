import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getAllStudents(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user
        // get entity with subs
        const entity = await prisma.entity.findUnique({
            where: { user_id: sub },
            include: {
                EntitySubsidiary: true
            }
        })
        // find all students of all entities found
        const students = await prisma.student.findMany({
            where: { entityCourse: { OR: [{ entity_id: entity?.id }, { entitySubsidiary_id: { in: entity?.EntitySubsidiary.map(e => e.id) } }] } },
            select: {
                name: true,
                entityCourse: {
                    select: {
                        course: { select: { name: true } },
                        entity: { select: { id: true, socialReason: true } },
                        entitySubsidiary: { select: { id: true, socialReason: true } }
                    }
                }
            }
        })
        // group students by institution
        const groupedStudents = students.reduce((acc: { id: string, name: string, students: { name: string, course: string }[] }[], curr) => {
            const curr_entity = (curr.entityCourse.entity ?? curr.entityCourse.entitySubsidiary)!
            const alreadyExists = acc.find(e => e.id === curr_entity.id)
            const student = {
                name: curr.name,
                course: curr.entityCourse.course.name
            }
            if (alreadyExists) {
                alreadyExists.students.push(student)
                return acc
            }
            acc.push({
                id: curr_entity.id,
                name: curr_entity.socialReason,
                students: [student]
            })
            return acc
        }, [])
        return response.status(200).send(groupedStudents)
    } catch (err) {
        // if(err instanceof APIError){
        //     return 
        // }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}