import z from 'zod'
export const additionalInfoSchema = z.object({
    socialName: z.string().nullish(),
    gender: z.string().min(1, 'Gênero obrigatório'),
    profession: z.string().min(1, 'Profissão obrigatória'),
    nationality: z.string().min(1, 'Nacionalidade obrigatória'),
    natural_city: z.string().nullish(),
    natural_UF: z.string().nullish(),
}).superRefine((data, ctx) => {
    if (!data.natural_city) {
        ctx.addIssue({
            message: "Cidade natal obrigatória",
            path: ["natural_city"]
        })
    }
    if (!data.natural_UF) {
        ctx.addIssue({
            message: "Unidade federativa obrigatória",
            path: ["natural_UF"]
        })
    }
})