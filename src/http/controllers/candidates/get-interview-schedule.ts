import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCandidateInterviewSchedule(
    request: FastifyRequest,
    response: FastifyReply
) {
    const params = z.object({
        announcement_id: z.string(),
        assistant_id: z.string()
    })

    try {
        const { announcement_id, assistant_id } = params.parse(request.params)
        const announcement = await prisma.announcement.findFirst({
            where: { AND: [{ id: announcement_id }, { socialAssistant: { some: { id: assistant_id } } }] },
            include: {
                interview: true,
                InterviewSchedule: true
            }
        })
        if (!announcement || !announcement.interview) {
            if (!announcement) {
                throw new Error("Edital não encontrado ou assistente não vinculado(a)")
            }
            throw new Error("Este edital não permite entrevistas")
        }
        const availableSchedule = () => {
            const begin = announcement.interview!.startDate
            const end = announcement.interview!.endDate
            const { duration, interval, endHour } = announcement.interview!
            let curr = begin;
            const result = []
            while (curr < end) {
                let index = 0
                let times = [announcement.interview!.beginHour]
                let currTime = new Date(curr)
                // get current date and hour
                currTime.setHours(times[index].getHours())
                currTime.setMinutes(times[index].getMinutes())
                while (currTime.getHours() < endHour.getHours()) {
                    currTime.setMinutes(currTime.getMinutes() + duration + interval)
                    times.push(new Date(currTime))
                }
                result.push({
                    date: new Date(curr),
                    times: times.map(e => `${e.getUTCHours()}:${e.getUTCMinutes().toString().padStart(2, '0')}`)
                })

                index += 1
                curr.setDate(curr.getDate() + 1)
            }
            return result[0]
        }
        console.log(availableSchedule())
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}