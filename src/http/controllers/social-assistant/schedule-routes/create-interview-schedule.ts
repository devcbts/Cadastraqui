import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';

export default async function createInterviewSchedule(request: FastifyRequest,
    reply: FastifyReply
) {
    const params = z.object({
        announcement_id: z.string(),
    })

    const createInterviewBody = z.object({
        startDate: z.string(),
        endDate: z.string(),
        beginHour: z.string(),
        duration: z.number().min(1, { message: "Duração deve ser maior que 0" }),
        interval: z.number().min(1, { message: "Intervalo deve ser maior que 0" }),
        endHour: z.string(),
    })

    const { announcement_id } = params.parse(request.params)
    const { startDate, endDate, beginHour, duration, interval, endHour } = createInterviewBody.parse(request.body)
    try {

        const user_id = request.user.sub
        const socialAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id }
        })
        if (!socialAssistant) {
            throw new ForbiddenError()
        }
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id, socialAssistant: { some: { id: socialAssistant.id } } },
            include: {
                interview: true,
            }
        })
        // Verificações do Edital
        if (!announcement) {
            throw new Error("Edital não encontrado ou assistente não vinculado(a)")
        }

        if (!announcement.interview) {
            throw new Error("Este edital não permite entrevistas")

        }

        if (new Date(startDate) < announcement.interview.startDate || new Date(endDate) > announcement.interview.endDate) {
            throw new Error("Data de início ou fim da entrevista fora do período permitido")

        }
        if (new Date(beginHour) < announcement.interview.beginHour || new Date(endHour) > announcement.interview.endHour) {
            throw new Error("Horário de início ou fim da entrevista fora do período permitido")

        }

        if (new Date(startDate) > new Date(endDate)) {
            throw new Error("Data de início da entrevista não pode ser maior que a data de fim")

        }

        if (new Date(beginHour) > new Date(endHour)) {
            throw new Error("Horário de início da entrevista não pode ser maior que o horário de fim")

        }

        if (interval < announcement.interview.interval || duration > announcement.interview.duration) {
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
                }
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
        await prisma.$transaction(async (tsPrisma) => {
            // Criar o intervalo na agenda da Assistente 
            const {id} = await tsPrisma.assistantSchedule.create({
                data: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    beginHour: parseTimeToDate(beginHour),
                    endHour: parseTimeToDate(endHour),
                    duration,
                    interval,
                    announcement_id: announcement_id,
                    assistant_id: socialAssistant.id
                }
            })

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
                            announcement_id,
                            assistantSchedule_id: id
                        }
                    })
                }))

            }))
        }
        )

        return reply.status(201).send({ message: "Agenda de entrevista criada com sucesso" })
    } catch (err: any) {
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message })

        }
        if (err instanceof Error) {
            return reply.status(412).send({ message: err.message })

        }
        return reply.status(500).send({ message: err })
    }
}




function parseTimeToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(toNumber);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function toNumber(value: string): number {
    return parseInt(value, 10);
}