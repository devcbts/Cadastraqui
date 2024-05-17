const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const compensationSchema = z.object({
    hasCompensation: z.boolean(),
    compensationValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hasCompensation && !data.compensationValue) {
        ctx.addIssue({
            message: 'Valor dos estornos/compensações obrigatório',
            path: ["compensationValue"]
        })
    }
})
export default compensationSchema