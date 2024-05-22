const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const compensationSchema = z.object({
    hascompensationValue: z.boolean(),
    compensationValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hascompensationValue && !data.compensationValue) {
        ctx.addIssue({
            message: 'Valor dos estornos/compensações obrigatório',
            path: ["compensationValue"]
        })
    }
})
export default compensationSchema