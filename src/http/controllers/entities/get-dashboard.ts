import { NotAllowedError } from "@/errors/not-allowed-error";
import { prisma } from "@/lib/prisma";
import getCandidateInterestForDashboard from "@/utils/dashboard/get-candidate-interest";
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
                    where: { announcementDate: { gte: new Date() } },
                    include: {
                        educationLevels: {
                            where: { announcement: { announcementDate: { gte: new Date() } } },
                            include: {
                                course: true,
                                _count: {
                                    select: {
                                        Application: true
                                        // { where: { candidateStatus: null } }
                                    }
                                }
                            },
                        },
                        _count: {
                            select: {
                                Application: {
                                    where: {
                                        AND: [{ announcement: { announcementDate: { gte: new Date() } } },
                                            // { candidateStatus: null }
                                        ]
                                    }
                                }
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
        const announcements = entity.Announcement
        // Pegar dados do gráfico de Candidatos
        const candidatesInterest = await getCandidateInterestForDashboard(announcements)

        // .filter((e => e.announcementDate! > new Date()))
        const vacancies = announcements.reduce((acc, announcement) => {
            return acc += announcement.verifiedScholarships
        }, 0)
        console.log(announcements.length)
        const subscriptions = announcements.reduce((acc, announcement) => {
            return acc += announcement._count.Application
        }, 0)


        console.log('LENGTH', entity.EntitySubsidiary.map(e => e.Announcement.length))
        //Sum each educationalLevel application for each announcement, sorted by its entity
        const entities_info: ({ name: string, id: string })[] = entity.EntitySubsidiary.map(e => ({ name: e.socialReason, id: e.id }))
        // add 'null' id to represent the current entity
        entities_info.push({ name: entity.socialReason, id: entity.id })
        const announcements_ids = entity.Announcement.map(e => e.id).concat(entity.EntitySubsidiary.map(e => e.id))
        const education_levels = entity.Announcement.reduce((acc: any[], curr) => {
            acc.push(...curr.educationLevels.map(e => ({ count: e._count.Application, entity: e.entitySubsidiaryId })))
            return acc
        }, [])
        const unitVacancies = entities_info.reduce((acc: { name: string, id: number, applicants: number }[], curr) => {
            const curr_entity = (entity.id === curr.id ? entity : entity.EntitySubsidiary.find(e => e.id === curr.id))!
            // const total = curr_entity!.Announcement.reduce((an_acc, an_curr) => {
            //     return an_acc += an_curr._count.Application
            // }, 0)
            const total = education_levels.reduce((acc, curr) => {
                if (curr.entity === curr_entity.id || (entity.id === curr.id && curr.entity === null)) {
                    return acc += curr.count
                }
                return acc
            }, 0)
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
                    { announcement: { announcementDate: { gte: new Date() } } },
                    {
                        Application: {
                            some: {},
                            // every: { candidateStatus: null } 
                        }
                    }
                    ]
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
        console.log(courses.map(e => e.course))
        const courses_names = await prisma.course.findMany({
            where: { id: { in: courses.map(e => e.course.id) } },
        })
        const coursesApplicants = courses.reduce((acc: { id: number, name: string, applicants: number }[], curr) => {
            const course = courses_names.find(e => e.id === curr.course.id)
            if (!course) {
                return acc
            }
            const hasOnAcc = acc.find(e => e.id === curr.course.id)
            if (hasOnAcc) {
                // course already exists on acc
                hasOnAcc.applicants += curr._count.Application
                return acc
            }
            acc.push({
                id: course.id,
                name: course.name,
                applicants: curr._count.Application
            })
            return acc

        }, [])

        // 
        const announcementInterest = announcements.map(announcement => {

            const numberOfInterested = candidatesInterest.distributionByAnnouncement.find(e => e.announcement_id === announcement.id)?.numberOfInterested || 0
            return {
                id: announcement.id,
                name: announcement.announcementName,
                numberOfInterested,
            };
        });

        return response.status(200).send({
            announcements: announcements.length,
            vacancies,
            subscriptions,
            unit: unitVacancies,
            courses: coursesApplicants,
            candidatesInterest,
            announcementInterest
        })
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}




