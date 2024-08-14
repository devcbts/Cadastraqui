import { NotAllowedError } from "@/errors/not-allowed-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getEntityDashboard(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user
        // Get all subsidiaries and count its courses (EducationLevel) and the application count for the entity
        const entity = await prisma.entity.findUnique({
            where: { user_id: sub },
            include: {
                EntitySubsidiary: true,
                // EntitySubsidiary: {
                //     include: {
                //         EducationLevel: {
                //             select: { _count: { select: { Application: true } } }
                //         },
                //         Announcement: {
                //             include: {
                //                 _count: {
                //                     select: {
                //                         Application: true,
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // },
                Announcement: {
                    include: {
                        educationLevels: {
                            include: {
                                entitySubsidiary: true,
                                _count: {
                                    select: {
                                        Application: true
                                    }
                                }
                            },
                        },
                        _count: {
                            select: {
                                Application: true
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
        const entities_ids: (string | null)[] = entity.EntitySubsidiary.map(e => e.id)
        // add 'null' id to represent the current entity
        entities_ids.push(null)
        console.log('entities', entities_ids)
        const unitVacancies = entities_ids.map((id) => {
            // get all education by entity of each announcement
            const applicationByEntity: any[] = []
            const applicationByCourse: any[] = []
            // aux to keep track of all available courses of the announcement
            const currentAvailableCourses: string[] = []
            announcements.forEach((announcement) => {
                const educationalLevels = announcement.educationLevels.filter(l => l.entitySubsidiaryId === id)
                const appl = educationalLevels.reduce((acc: any, level) => {
                    return acc += level._count.Application
                }, 0)
                if (educationalLevels.length) {
                    const { entitySubsidiary } = educationalLevels?.[0]
                    console.log('SUBS', entitySubsidiary)
                    educationalLevels.forEach(level => {
                        if (level.grade) {
                            applicationByCourse.push({ course: level.grade, applicants: level._count.Application })
                            if (!currentAvailableCourses.includes(level.grade)) {
                                currentAvailableCourses.push(level.grade)
                            }
                        }
                    })
                    const name = entitySubsidiary ? entitySubsidiary?.socialReason : entity?.socialReason
                    applicationByEntity.push({ id: entitySubsidiary?.id ?? null, name, applicants: appl })
                }
            })
            // sum all participants from all education levels of all entity's announcements
            const entities = applicationByEntity.filter(e => e.id === id).reduce((acc, item) => {
                acc.name = item.name;
                acc.applicants += item.applicants;
                return acc;
            }, { name: '', applicants: 0 })
            const courses = currentAvailableCourses.map(course => {
                return applicationByCourse.filter(e => e.course === course).reduce((acc, item) => {
                    acc.course = item.course;
                    acc.applicants += item.applicants;
                    return acc;
                }, { course: '', applicants: 0 })
            })
            return { entities, courses }
        })
        return response.status(200).send({
            announcements: announcements.length,
            vacancies,
            subscriptions,
            unit: unitVacancies.map(e => e.entities),
            courses: unitVacancies.reduce((acc: any[], item) => {
                acc = item.courses.concat(acc)
                return acc
            }, [])
        })
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}