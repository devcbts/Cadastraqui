const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const advancePaymentSchema = z.object({
    hasadvancePaymentValue: z.boolean(),
    advancePaymentValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hasadvancePaymentValue && !data.advancePaymentValue) {
        ctx.addIssue({
            message: 'Valor dos adiantamentos/antecipações obrigatório',
            path: ["advancePaymentValue"]
        })
    }
})
export default advancePaymentSchema