import stringToFloat from "utils/string-to-float";

const { z } = require("zod");

const unemployementInsuranceSchema = z.object({
    receivesUnemployment: z.boolean(),
    parcels: z.number().nullish(),
    firstParcelDate: z.string().date('Data inválida').nullish(),
    parcelValue: z.string().nullish().transform(stringToFloat)
}).superRefine((data, ctx) => {
    if (data.receivesUnemployment) {
        if (!data.parcelValue) {
            ctx.addIssue({
                message: "Valor da parcela obrigatório",
                path: ["parcelValue"]
            })
        }
        if (!data.firstParcelDate) {
            ctx.addIssue({
                message: "Data da primeira parcela obrigatória",
                path: ["firstParcelDate"]
            })
        }
        if (!data.parcels) {
            ctx.addIssue({
                message: "Quantidade de parcelas obrigatória",
                path: ["parcels"]
            })
        }
    }
})

export default unemployementInsuranceSchema