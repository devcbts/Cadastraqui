import expenseSchema from "../../Expenses/schemas/expense-schema";

const { z } = require("zod");

const expenseSelectionSchema = z.object({
    months: z.array(
        expenseSchema.refine(data => data.isUpdated, { message: 'Mês não preenchido', path: ['isUpdated'] })
    ).min(3).max(3)
}).transform(data => ({ expenses: data.months }))

export default expenseSelectionSchema