const { z } = require("zod");

const interviewSchema = z.object({
    startDate: z.string().date('Data inválida'),
    endDate: z.string().date('Data inválida'),
    duration: z.number({ invalid_type_error: 'Duração obrigatória' }),
    beginHour: z.string().min(1, 'Horário de início obrigatório'),
    endHour: z.string().min(1, 'Horário de término obrigatório'),
    interval: z.number({ invalid_type_error: 'Intervalo obrigatório' })
}).superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
        ctx.addIssue({
            message: 'Término das entrevistas deve ser maior que a data de início',
            path: ['endDate']
        })
    }
})

export default interviewSchema