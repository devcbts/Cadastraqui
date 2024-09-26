import { NotAllowedError } from "@/errors/not-allowed-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import SelectEntityOrDirector from "./utils/select-entity-or-director";

export default async function getEntityDashboard(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user
        // Get all subsidiaries and count its courses (EducationLevel) and the application count for the entity
        const entityOrDirector = await SelectEntityOrDirector(sub, request.user.role)
        const entity = await prisma.entity.findUnique({
            where: { id: entityOrDirector.id },
            include: {
                EntitySubsidiary: {
                    include: {
                        Announcement: {
                            include: {
                                _count: {
                                    select: {
                                        Application: true,
                                    }
                                }
                            }
                        }
                    }
                },

                Announcement: {
                    include: {
                        // educationLevels: {
                        //     include: {
                        //         course: true,
                        //         entitySubsidiary: true,
                        //         _count: {
                        //             select: {
                        //                 Application: true
                        //             }
                        //         }
                        //     },
                        // },
                        _count: {
                            select: {
                                Application: { where: { candidateStatus: null } }
                            }
                        }
                    }
                }
            }
        })
        if (!entity) {
            throw new NotAllowedError()
        }
        /*
         * return the number of:
        announcements - how many open announcements for the entity
        vacancies - sum of the vacancies of all announcement courses
        subscriptions - sum of all applications made to the current announcement
        unitVacancies - sum of all applications to a specific subsidiary
         */
        const announcements = entity.Announcement.filter((e => e.announcementDate! > new Date()))
        const vacancies = announcements.reduce((acc, announcement) => {
            return acc += announcement.verifiedScholarships
        }, 0)
        const subscriptions = announcements.reduce((acc, announcement) => {
            return acc += announcement._count.Application
        }, 0)



        //Sum each educationalLevel application for each announcement, sorted by its entity
        const entities_info: ({ name: string, id: string })[] = entity.EntitySubsidiary.map(e => ({ name: e.socialReason, id: e.id }))
        // add 'null' id to represent the current entity
        entities_info.push({ name: entity.socialReason, id: entity.id })
        const announcements_ids = entity.Announcement.map(e => e.id).concat(entity.EntitySubsidiary.map(e => e.id))
        const unitVacancies = entities_info.reduce((acc: { name: string, id: number, applicants: number }[], curr) => {
            const curr_entity = (entity.id === curr.id ? entity : entity.EntitySubsidiary.find(e => e.id === curr.id))!
            const total = curr_entity!.Announcement.reduce((an_acc, an_curr) => {
                return an_acc += an_curr._count.Application
            }, 0)
            console.log(curr_entity.socialReason, total)
            acc.push({
                name: curr_entity.socialReason,
                id: parseInt(curr_entity.CNPJ.replace(/\D*/g, '')),
                applicants: total
            })
            return acc
        }, [])
        const courses = await prisma.educationLevel.findMany({
            where: {
                AND:
                    [{ announcementId: { in: announcements_ids } },
                    { announcement: { announcementDate: { gt: new Date() } } }]
            },
            select: {
                course: {
                    select: {
                        id: true
                    }
                },
                _count: {
                    select: {
                        Application: true
                    }
                }
            }

        })
        const courses_names = await prisma.course.findMany({
            where: { id: { in: courses.map(e => e.course.id) } },
        })
        const coursesApplicants = courses.reduce((acc: { id: number, name: string, applicants: number }[], curr) => {
            const course = courses_names.find(e => e.id === curr.course.id)
            if (!course) {
                return acc
            }
            acc.push({
                id: course.id,
                name: course.name,
                applicants: curr._count.Application
            })
            return acc

        }, [])

        return response.status(200).send({
            announcements: announcements.length,
            vacancies,
            subscriptions,
            unit: unitVacancies,
            courses: coursesApplicants
        })
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}