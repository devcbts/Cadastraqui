import stringToFloat from "utils/string-to-float";

const { z } = require("zod");

const pensionSchema = z.object({
    checkPension: z.boolean().nullish(),
    judicialPensionValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.checkPension && !data.judicialPensionValue) {
        ctx.addIssue({
            message: 'Valor da pensão obrigatório',
            path: ["judicialPensionValue"]
        })
    }
})

export default pensionSchema