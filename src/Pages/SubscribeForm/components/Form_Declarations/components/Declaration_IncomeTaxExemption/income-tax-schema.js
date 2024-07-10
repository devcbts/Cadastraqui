import { z } from "zod";

export default z.object({
    confirmation: z.boolean(),
    file: z.instanceof(File).nullish(),
    year: z.string().nullish()
}).superRefine((data, ctx) => {
    if (!data.confirmation) {
        if (!data.file) {
            ctx.addIssue({
                message: 'Arquivo obrigatório',
                path: ['file']
            })
        }
        if (!data.year) {
            ctx.addIssue({
                message: 'Exercício obrigatório',
                path: ['year']
            })
        }
    }
})