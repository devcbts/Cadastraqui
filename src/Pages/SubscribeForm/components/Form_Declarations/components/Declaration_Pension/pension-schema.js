import stringToFloat from "utils/string-to-float";
import { isValidCPF } from "utils/validate-cpf";
import { z } from "zod";

export default z.object({
    receivesPension: z.boolean(),
    payerName: z.string().nullish(),
    payerCpf: z.string().nullish(),
    amount: z.string().nullish()
}).superRefine((data, ctx) => {
    if (data.receivesPension) {
        if (!data.payerName) {
            ctx.addIssue({
                message: 'Nome obrigatório',
                path: ["payerName"]
            })
        }
        if (!data.payerCpf || !isValidCPF(data.payerCpf)) {
            ctx.addIssue({
                message: 'CPF inválido',
                path: ["payerCpf"]
            })
        }
        if (!data.amount || stringToFloat(data.amount) === 0) {
            ctx.addIssue({
                message: 'Valor não pode ser zero',
                path: ["amount"]
            })
        }
    }
})