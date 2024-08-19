import { isValidCPF } from "utils/validate-cpf";
import { z } from "zod";

export default z.object({
    confirmation: z.boolean(),
    partnerName: z.string().nullish(),
    unionStartDate: z.string().nullish(),
    CPF: z.string().nullish()
}).superRefine((data, ctx) => {
    if (data.confirmation) {
        if (!data.partnerName) {
            ctx.addIssue({
                message: 'Nome do(a) parceiro(a) obrigatório',
                path: ['partnerName']
            })
        }
        if (!data.unionStartDate) {
            ctx.addIssue({
                message: 'Data inválida',
                path: ['unionStartDate']
            })
        }
        if (!data.CPF) {
            ctx.addIssue({
                message: 'CPF obrigatório',
                path: ['CPF']
            })
        }
        if (!isValidCPF(data.CPF)) {
            ctx.addIssue({
                message: 'CPF inválido',
                path: ['CPF']
            })
        }
    }
})