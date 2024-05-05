import z from 'zod'

const personalDataFormSchema = z.object({
    fullName: z.string().min(1),
    CPF: z.string().min(1),
    birthDate: z.string().date(),
    email: z.string().email().min(1),
    phone: z.string().min(1),
})

export default personalDataFormSchema