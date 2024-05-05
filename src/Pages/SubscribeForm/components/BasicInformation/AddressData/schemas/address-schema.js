import z from 'zod'

export const addressDataSchema = z.object({
    CEP: z.string().min(1),
    address: z.string().min(1),
    addressNumber: z.string().min(1),
    UF: z.string().min(1),
    neighborhood: z.string().min(1),
    city: z.string().min(1)
})