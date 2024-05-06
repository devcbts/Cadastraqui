import z from 'zod'
export const additionalInfoSchema = z.object({
    socialName: z.string().optional(),
    gender: z.string().min(1, 'Gênero obrigatório'),
    profession: z.string().min(1, 'Profissão obrigatória'),
    naturality: z.string().min(1, 'Naturalidade obrigatória'),
    nacionality: z.string().min(1, 'Nacionalidade obrigatória'),
}) 