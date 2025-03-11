import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import getCandidateInterestForDashboard from "@/utils/dashboard/get-candidate-interest";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getAssistantDashboard(request: FastifyRequest, reply: FastifyReply) {

    try {
        const user_id = request.user.sub
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id: user_id }
        })
        if (!isAssistant) {
            throw new ForbiddenError()
        }
        const myAnnouncements = await prisma.announcement.findMany({
            where: {
                socialAssistant: {
                    some: { id: isAssistant.id }
                }
            },
            include: {
                interview: true,
                Application: {
                    where: { socialAssistant_id: isAssistant.id },
                    include: {
                        requests: true
                    }
                },

            }


        })
        const allAnnouncements = myAnnouncements.length
        const applicationAnnouncements = myAnnouncements.filter(announcement => announcement.openDate! < new Date() && announcement.closeDate! > new Date()).length
        const avaliationAnnouncements = myAnnouncements.filter(announcement => announcement?.interview?.endDate! < new Date() && announcement?.interview?.startDate! > new Date()).length
        const closedAnnoncements = myAnnouncements.filter(announcement => announcement.announcementDate! < new Date()).length
        const pendingApplications = myAnnouncements.reduce((acc, announcement) => acc + announcement.Application.filter(application => application.status === 'Pending').length, 0)
        const approvedApplications = myAnnouncements.reduce((acc, announcement) => acc + announcement.Application.filter(application => application.status === 'Approved').length, 0)
        const numberOfRequests = myAnnouncements.reduce((acc, announcement) => acc + announcement.Application.reduce((acc, application) => acc + application.requests.length, 0), 0)
        const resolvedRequests = myAnnouncements.reduce((acc, announcement) => acc + announcement.Application.reduce((acc, application) => acc + application.requests.filter(request => request.answered).length, 0), 0)

        const interviews = await prisma.interviewSchedule.findMany({
            where: { assistant_id: isAssistant.id, date: { gte: new Date() } }
        })
        const allInterviews = interviews.length
        const todayInterviews = interviews.filter(interview => interview.date.toDateString() === new Date().toDateString()).length

        const candidateInterest = await getCandidateInterestForDashboard(myAnnouncements)

        return reply.status(200).send({
            allAnnouncements,
            applicationAnnouncements,
            avaliationAnnouncements,
            closedAnnoncements,
            pendingApplications,
            approvedApplications,
            numberOfRequests,
            resolvedRequests,
            allInterviews,
            todayInterviews,
            candidateInterest

        })

    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })

        }
        return reply.status(500).send({ message: 'Internal server error' })
    }
}