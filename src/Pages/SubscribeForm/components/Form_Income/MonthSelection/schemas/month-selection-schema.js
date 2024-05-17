const { z } = require("zod");

const monthSelectionSchema = (quantity) => z.object({
    incomes: z.array(z.object({
        date: z.date().or(z.string().transform(v => new Date(v))).default(new Date()),
        grossAmount: z.number().default(0),
        proLabore: z.number().default(0),
        dividends: z.number().default(0),
        deductionValue: z.number().default(0),
        publicPension: z.number().default(0),
        incomeTax: z.number().default(0),
        otherDeductions: z.number().default(0),
        foodAllowanceValue: z.number().default(0),
        transportAllowanceValue: z.number().default(0),
        expenseReimbursementValue: z.number().default(0),
        advancePaymentValue: z.number().default(0),
        reversalValue: z.number().default(0),
        compensationValue: z.number().default(0),
        judicialPensionValue: z.number().default(0),
        isUpdated: z.boolean().default(false).refine((v) => v, { message: 'Mês não preenchido' })
    })).min(quantity).max(quantity)
})

export default monthSelectionSchema