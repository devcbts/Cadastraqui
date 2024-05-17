const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const transportAllowanceSchema = z.object({
    hasTransportAllowance: z.boolean(),
    transportAllowanceValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hasTransportAllowance && !data.transportAllowanceValue) {
        ctx.addIssue({
            message: 'Valor do auxílio transporte obrigatório',
            path: ["transportAllowanceValue"]
        })
    }
})
export default transportAllowanceSchema