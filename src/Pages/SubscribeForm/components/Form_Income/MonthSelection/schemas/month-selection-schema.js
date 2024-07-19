import stringToFloat from "utils/string-to-float";

const { z } = require("zod");

const monthSelectionSchema = (quantity) => z.object({
    months: z.array(z.object({
        id: z.string().nullish(),
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
        file_document: z.instanceof(File).nullish(),
        url_document: z.string().nullish(),
        skipMonth: z.boolean().default(false),
        isUpdated: z.boolean().default(false)
    }).superRefine((data, ctx) => {
        if (!data.skipMonth) {
            if (!data.isUpdated) {
                ctx.addIssue({
                    message: 'Mês desatualizado',
                    path: ['isUpdated']
                })
            }
        }
    })

    ).min(quantity).max(quantity)
})
    .transform((data) => {
        return {
            incomes: data.months.map((e) => {
                const month = e.date.getMonth() + 1
                const year = e.date.getFullYear()
                return ({ ...e, [`file_rendimentos-${month}-${year}`]: e.file_document, file_document: null, receivedIncome: !e.skipMonth })
            })
        }
    })

export default monthSelectionSchema