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
                EntitySubsidiary: {
                    include: {
                        EducationLevel: {
                            select: { _count: { select: { Application: true } } }
                        },
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
                        educationLevels: {

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

        const unitVacancies = entity.EntitySubsidiary.map((e) => {
            const applicants = e.EducationLevel.reduce((acc, course) => {
                return acc += course._count.Application
            }, 0)
            return ({
                name: e.socialReason,
                applicants
            })
        })
        return response.status(200).send({
            announcements: announcements.length,
            vacancies,
            subscriptions,
            unitVacancies
        })
    } catch (err) {
        return response.status(400).send({ message: err })
    }
}