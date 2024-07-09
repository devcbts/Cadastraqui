import { z } from "zod";

export default z.object({
    confirmation: z.boolean(),
    partnerName: z.string().nullish(),
    unionStartDate: z.string().nullish()
}).superRefine((data, ctx) => {
    if (data.confirmation) {
        if (!data.partnerName) {
            ctx.addIssue({
                message: 'Nome do(a) parceiro(a) obrigatório',
                path: ['partnerName']
            })
        }
        if (!data.partnerName) {
            ctx.addIssue({
                message: 'Data inválida',
                path: ['unionStartDate']
            })
        }
    }
})