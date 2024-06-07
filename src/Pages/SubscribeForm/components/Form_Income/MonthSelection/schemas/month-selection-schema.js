import stringToFloat from "utils/string-to-float";

const { z } = require("zod");

const monthSelectionSchema = (quantity) => z.object({
    months: z.array(z.object({
        date: z.date().or(z.string().transform(v => new Date(v))).default(new Date()),
        grossAmount: z.string().nullish().transform(stringToFloat),
        proLabore: z.string().nullish().transform(stringToFloat),
        dividends: z.string().nullish().transform(stringToFloat),
        deductionValue: z.string().nullish().transform(stringToFloat),
        publicPension: z.string().nullish().transform(stringToFloat),
        incomeTax: z.string().nullish().transform(stringToFloat),
        otherDeductions: z.string().nullish().transform(stringToFloat),
        foodAllowanceValue: z.string().nullish().transform(stringToFloat),
        transportAllowanceValue: z.string().nullish().transform(stringToFloat),
        expenseReimbursementValue: z.string().nullish().transform(stringToFloat),
        advancePaymentValue: z.string().nullish().transform(stringToFloat),
        reversalValue: z.string().nullish().transform(stringToFloat),
        compensationValue: z.string().nullish().transform(stringToFloat),
        judicialPensionValue: z.string().nullish().transform(stringToFloat),
        isUpdated: z.boolean().default(false).refine((v) => v, { message: 'Mês não preenchido' })
    })).min(quantity).max(quantity)
}).transform((data) => {
    return { incomes: data.months }
})

export default monthSelectionSchema