import stringToFloat from "utils/string-to-float";

const { z } = require("zod");

const pensionSchema = z.object({
    hasjudicialPensionValue: z.boolean().nullish(),
    judicialPensionValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hasjudicialPensionValue && !data.judicialPensionValue) {
        ctx.addIssue({
            message: 'Valor da pensão obrigatório',
            path: ["judicialPensionValue"]
        })
    }
})

export default pensionSchema