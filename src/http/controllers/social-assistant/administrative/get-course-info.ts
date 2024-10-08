import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCourseInfo(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        educationLevel_id: z.string()
    })

    try {
        const { educationLevel_id } = schema.parse(request.params)

        const course = await prisma.educationLevel.findUnique({
            where: { id: educationLevel_id },
            include: {
                course: true,
                entitySubsidiary: true,
                announcement: {
                    include:
                        { entity: true }
                },
                Application: {
                    select:
                        { id: true }
                },
                _count: { select: { Application: true } }
            }
        })
        if (!course) {
            throw new APIError('Curso não encontrado')
        }
        let entity = course?.entitySubsidiary ?? course?.announcement.entity
        const applicationStatuses = await prisma.application.groupBy({
            by: ["status"],
            where: { educationLevel_id },
            _count: { _all: true }
        })
        const applicationCandidateStatuses = await prisma.application.groupBy({
            by: ["candidateStatus"],
            where: { educationLevel_id },
            _count: { _all: true }
        })
        const requests = await prisma.requests.groupBy({
            by: ["type"],
            where: { application_id: { in: course?.Application.map(e => e.id) } },
            _count: { _all: true }
        })
        const notAnalysed = applicationStatuses.find(e => e.status === "NotAnalysed")?._count._all ?? 0
        const waitingAnalysis = applicationStatuses.find(e => e.status === "Pending")?._count._all ?? 0
        const approved = applicationStatuses.find(e => e.status === "Approved")?._count._all ?? 0
        const reproved = applicationStatuses.find(e => e.status === "Rejected")?._count._all ?? 0
        const waitingList = applicationCandidateStatuses.find(e => e.candidateStatus === "WaitingList")?._count._all ?? 0
        const docRequests = requests.find(e => e.type === "Document")?._count._all ?? 0
        const interview = requests.find(e => e.type === "Interview")?._count._all ?? 0
        const visit = requests.find(e => e.type === "Visit")?._count._all ?? 0
        return response.status(200).send({
            notAnalysed,
            waitingAnalysis,
            waitingList,
            approved,
            reproved,
            docRequests,
            interview,
            visit,
            entity,
            applicants: course?._count.Application,
            vacancies: course?.verifiedScholarships
        })
    } catch (err) {
        if (err instanceof APIError) {

            return response.status(400).send({ message: err.message })
        }
        console.log(err)
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}