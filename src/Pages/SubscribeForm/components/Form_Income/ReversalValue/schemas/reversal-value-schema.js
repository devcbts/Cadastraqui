const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const reversalValueSchema = z.object({
    hasreversalValue: z.boolean(),
    reversalValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hasreversalValue && !data.reversalValue) {
        ctx.addIssue({
            message: 'Valor das indenizações obrigatório',
            path: ["reversalValue"]
        })
    }
})
export default reversalValueSchema