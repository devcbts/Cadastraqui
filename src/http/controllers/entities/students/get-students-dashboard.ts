import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getStudentsDashboard(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user
        let result: {
            count: number,
            scholarshipPartial: number,
            scholarshipTotal: number,
            units: { count: number, name: string, id: number }[],
            courses: { count: number, course: string, id: number }[]
        } | null = null
        await prisma.$transaction(async (tPrisma) => {
            const entity = await tPrisma.entity.findUnique({
                where: {
                    user_id: sub
                },
                include: { EntitySubsidiary: true }
            })
            const subsidiaries_ids = entity!.EntitySubsidiary?.map(e => e.id) ?? []
            const whereClause = {
                entityCourse: { OR: [{ entity_id: entity!.id }, { entitySubsidiary_id: { in: subsidiaries_ids } }] },
            }
            const count = await tPrisma.student.count({
                where: whereClause,
            })

            const scholarshipType = await tPrisma.student.groupBy({
                by: ["isPartial"],
                where: whereClause,
            })
            // group students by their course
            const groupedByCourses = await tPrisma.student.groupBy({
                where: whereClause,
                by: ["entityCourse_id"],
                _count: {
                    _all: true
                }
            })

            const courses_ids = groupedByCourses.map(e => e.entityCourse_id)
            // find the courses that are available on each entity/subsidiary
            const entityCourses = await tPrisma.entityCourse.findMany({
                where: { id: { in: courses_ids } },
                select: {
                    id: true,
                    entity: true,
                    entitySubsidiary: true,
                    course: true,
                    _count: { select: { Student: true } }
                },
            })
            const units = [entity!.id].concat(subsidiaries_ids).reduce((acc: { count: number, name: string, id: number }[], curr) => {
                const studentsByUnit = entityCourses.reduce((course_acc, course_curr) => {
                    if (![course_curr.entity?.id, course_curr.entitySubsidiary?.id].includes(curr)) {
                        return course_acc
                    }
                    return {
                        count: course_acc.count + course_curr._count.Student,
                        name: course_curr.entity?.socialReason ?? course_curr.entitySubsidiary!.socialReason,
                        id: parseInt(curr.replace(/\D*/g, ''))
                    }
                }, { count: 0, name: '', id: 0 })
                if (studentsByUnit.count !== 0) {
                    acc.push(studentsByUnit)
                }
                return acc
            }, [])
            const courses = groupedByCourses.reduce((acc: { count: number, course: string, id: number }[], curr) => {
                const studentsByCourse = entityCourses.reduce((course_acc, course_curr) => {
                    if (curr.entityCourse_id !== course_curr.id) {
                        return course_acc
                    }
                    return {
                        course: course_curr.course.name,
                        count: curr._count._all,
                        id: course_curr.course.id
                    }
                }, { count: 0, course: '', id: 0 })
                if (studentsByCourse.count !== 0) {
                    acc.push(studentsByCourse)
                }
                return acc
            }, [])

            result = {
                count,
                courses,
                units,
                scholarshipPartial: scholarshipType.filter(e => e.isPartial).length,
                scholarshipTotal: scholarshipType.filter(e => !e.isPartial).length,
            }
        })

        return response.status(200).send(result)

    } catch (err) {
        console.log(err)
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}