const { z } = require("zod");

const interviewSchema = z.object({
    startDate: z.string().date('Data inválida'),
    endDate: z.string().date('Data inválida'),
    duration: z.number().int().default(20),
    beginHour: z.string(),
    endHour: z.string(),
    interval: z.number().int().default(5)
})

export default interviewSchema