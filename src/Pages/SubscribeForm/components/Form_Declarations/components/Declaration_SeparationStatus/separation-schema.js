import { isValidCPF } from "utils/validate-cpf";
import { z } from "zod";

export default z.object({
    confirmation: z.boolean(),
    personDetails: z.object({
        personName: z.string().nullish(),
        personCpf: z.string().nullish(),
        separationDate: z.string().nullish(),
        knowsCurrentAddress: z.boolean().nullish(),
    })
}).superRefine((data, ctx) => {
    if (data.confirmation) {
        if (!data.personDetails.personName) {
            ctx.addIssue({
                message: 'Nome obrigatório',
                path: ["personDetails.personName"]
            })
        }
        if (!data.personDetails.personCpf || !isValidCPF(data.personDetails.personCpf)) {
            ctx.addIssue({
                message: 'CPF inválido',
                path: ["personDetails.personCpf"]
            })
        }
        if (!data.personDetails.separationDate) {
            ctx.addIssue({
                message: 'Data inválida',
                path: ["personDetails.separationDate"]
            })
        }
        if (data.personDetails.knowsCurrentAddress === null) {
            ctx.addIssue({
                message: 'Marque uma opção',
                path: ["personDetails.knowsCurrentAddress"]
            })
        }
    }
})