const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const advancePaymentSchema = z.object({
    hasPayment: z.boolean(),
    advancePaymentValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hasPayment && !data.advancePaymentValue) {
        ctx.addIssue({
            message: 'Valor dos adiantamentos/antecipações obrigatório',
            path: ["advancePaymentValue"]
        })
    }
})
export default advancePaymentSchema