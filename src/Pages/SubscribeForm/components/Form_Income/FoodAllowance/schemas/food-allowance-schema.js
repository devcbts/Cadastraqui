const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const foodAllowanceSchema = z.object({
    hasfoodAllowanceValue: z.boolean(),
    foodAllowanceValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hasfoodAllowanceValue && !data.foodAllowanceValue) {
        ctx.addIssue({
            message: 'Valor do auxílio alimentação obrigatório',
            path: ["foodAllowanceValue"]
        })
    }
})
export default foodAllowanceSchema