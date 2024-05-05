import z from 'zod'
export const additionalInfoSchema = z.object({
    socialName: z.string().optional(),
    gender: z.string().min(1),
    profession: z.string().min(1),
    naturality: z.string().min(1),
    nacionality: z.string().min(1),
}) 