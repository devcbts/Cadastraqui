import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { getHours, getMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';

export default async function updateInterviewSchedule(request: FastifyRequest,
    reply: FastifyReply
) {
    const params = z.object({
        schedule_id: z.string(),

    })

    const updateInterviewBody = z.object({
        startDate: z.string(),
        endDate: z.string(),
        beginHour: z.string(),
        duration: z.number().min(1, { message: "Duração deve ser maior que 0" }),
        interval: z.number().min(1, { message: "Intervalo deve ser maior que 0" }),
        endHour: z.string(),
    })

    const { schedule_id } = params.parse(request.params)
    const { startDate, endDate, beginHour, duration, interval, endHour } = updateInterviewBody.parse(request.body)
    try {

        const user_id = request.user.sub
        const socialAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id }
        })
        if (!socialAssistant) {
            throw new ForbiddenError()
        }
        const schedule = await prisma.assistantSchedule.findUnique({
            where: { id: schedule_id, assistant_id: socialAssistant.id },
            include: {
                announcement: {
                    include: {
                        interview: true
                    }
                }
            }
        })
        // Verificações do Edital
        if (!schedule) {
            throw new ResourceNotFoundError()
        }

        if (!schedule.announcement.interview) {
            throw new Error("Este edital não permite entrevistas")

        }
        if (new Date() > schedule.announcement.closeDate!) {
            throw new Error("Período de inscrição do edital já encerrado, não é mais possível alterar os horários de entrevista")
        }

        if (new Date(startDate) < schedule.announcement.interview.startDate || new Date(endDate) > schedule.announcement.interview.endDate) {
            throw new Error("Data de início ou fim da entrevista fora do período permitido")

        }
        if (compareHours(parseTimeToDate(beginHour), schedule.announcement.interview.beginHour) === -1 || compareHours(parseTimeToDate(endHour), schedule.announcement.interview.endHour) === 1) {
            throw new Error("Horário de início ou fim da entrevista fora do período permitido")

        }
        if (new Date(startDate) > new Date(endDate)) {
            throw new Error("Data de início da entrevista não pode ser maior que a data de fim")

        }

        if (new Date(beginHour) > new Date(endHour)) {
            throw new Error("Horário de início da entrevista não pode ser maior que o horário de fim")

        }

        if (interval < schedule.announcement.interview.interval || duration > schedule.announcement.interview.duration) {
            throw new Error("Intervalo ou duração da entrevista fora do permitido")

        }
        // Verificações para evitar sobrepoisção entre datas

        const interviewSchedules = await prisma.assistantSchedule.findMany({
            where: {
                assistant_id: socialAssistant.id,
                startDate: { // Verifica se a data de início está entre o intervalo de outra entrevista
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
                endDate: { // Verifica se a data de fim está entre o intervalo de outra entrevista
                    lte: new Date(endDate),
                    gte: new Date(startDate),
                },
                id: { not: schedule.id }

            }
        })


        if (interviewSchedules.length > 0) {
            throw new Error("Já existe um período de entrevista para o período selecionado")

        }

        const availableTimesSchedule = () => {
            const begin = new Date(`${startDate}T00:00:00`);
            const end = new Date(`${endDate}T00:00:00`);

            let curr = begin;
            const result = [];
            while (curr < end) {
                let index = 0;
                let times = [parseTimeToDate(beginHour)];
                let currTime = new Date(curr);
                // get current date and hour
                currTime.setHours(times[index].getHours());
                currTime.setMinutes(times[index].getMinutes());
                while (currTime.getHours() < parseTimeToDate(endHour).getHours()) {
                    currTime.setMinutes(currTime.getMinutes() + duration + interval);
                    if (currTime.getHours() < parseTimeToDate(endHour).getHours() || (currTime.getHours() === parseTimeToDate(endHour).getHours() && currTime.getMinutes() <= parseTimeToDate(endHour).getMinutes())) {
                        times.push(new Date(currTime));
                    }
                }
                result.push({
                    date: new Date(curr),
                    times: times.map(e => new Date(e)) // Armazena diretamente os objetos Date
                });

                index += 1;
                curr.setDate(curr.getDate() + 1);
            }
            return result;
        }
        const availableTimes = availableTimesSchedule();
        let id;
        await prisma.$transaction(async (tsPrisma) => {
            // Isso irá deletar o schedule antigo e criar um novo (e os horários disponíveis associados a ele)
            await tsPrisma.assistantSchedule.delete({
                where: {
                    id: schedule.id
                }

            })
            // Criar o intervalo na agenda da Assistente 
            const assistantSchedule = await tsPrisma.assistantSchedule.create({
                data: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    beginHour: parseTimeToDate(beginHour),
                    endHour: parseTimeToDate(endHour),
                    duration,
                    interval,
                    announcement_id: schedule.announcement.id,
                    assistant_id: socialAssistant.id
                }
            })
            id = assistantSchedule.id
            // Criar todos os possíveis intervalos no banco de dados
            await Promise.all(availableTimes.map(async (freeTimeDay) => {
                const date = new Date(freeTimeDay.date)

                await Promise.all(freeTimeDay.times.map(async (time) => {
                    date.setHours(time.getHours(), time.getMinutes(), 0, 0)
                    // need to create another date based on 'date' = date: new Date(date)
                    await tsPrisma.interviewSchedule.create({
                        data: {
                            date: new Date(date),
                            assistant_id: socialAssistant.id,
                            announcement_id: schedule.announcement.id,
                            assistantSchedule_id: assistantSchedule.id
                        }
                    })
                }))

            }))
        }
        )

        return reply.status(201).send({ message: "Agenda de entrevista atualizada com sucesso", id })

    } catch (err: any) {
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message })

        }
        if (err instanceof Error) {
            return reply.status(400).send({ message: err.message })

        }
        return reply.status(500).send({ message: err })
    }
}




function compareHours(dateA: Date | string, dateB: Date | string) {
    const [h_a, m_a] = [getHours(dateA), getMinutes(dateA)]
    const [h_b, m_b] = [getHours(dateB), getMinutes(dateB)]
    if (h_a > h_b) {
        return 1
    }
    if (h_a < h_b) {
        return -1
    }
    if (h_a === h_b) {
        if (m_a > m_b) {
            return 1
        }
        if (m_a < m_b) {
            return -1
        }
        if (m_a === m_b) {
            return 0
        }
    }

}

function parseTimeToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(toNumber);
    const timeZone = 'America/Sao_Paulo'
    // create date at time 0, since we'll compare just the hour/minute values
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0)
    date.setMilliseconds(0)
    // to save on UTC with user's input, we need to convert from the current timezone (fixed)
    // to UTC.
    // So if user's input is 13:00, it'll save on db based on the timezone passed
    // the date returned will be on UTC, so the further steps won't need any conversion
    // example: in => '13:00' timezone-> 'america/sao_paulo' out=> '16:00'
    //          in => '13:00' timezone-> 'europe/moscow' out=> '10:00'
    return fromZonedTime(date, timeZone);
}
function toNumber(value: string): number {
    return parseInt(value, 10);
}