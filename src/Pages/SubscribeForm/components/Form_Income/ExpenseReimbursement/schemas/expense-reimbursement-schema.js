const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const expenseReimbursementSchema = z.object({
    hasexpenseReimbursementValue: z.boolean(),
    expenseReimbursementValue: z.string().nullish().transform(stringToFloat),
}).superRefine((data, ctx) => {
    if (data.hasexpenseReimbursementValue && !data.expenseReimbursementValue) {
        ctx.addIssue({
            message: 'Valor das diárias/reembolsos obrigatório',
            path: ["expenseReimbursementValue"]
        })
    }
})
export default expenseReimbursementSchema