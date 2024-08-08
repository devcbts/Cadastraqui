
const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const expenseSchema = (values = []) => z.object({
    id: z.string().nullish(),
    date: z.date().or(z.string().transform(v => new Date(v))).default(new Date()),
    isUpdated: z.boolean().default(false),
    waterSewage: z.string().transform(stringToFloat).nullish(),
    electricity: z.string().transform(stringToFloat).nullish(),
    landlinePhone: z.string().transform(stringToFloat).nullish(),
    food: z.string().transform(stringToFloat).nullish(),
    rent: z.string().transform(stringToFloat).nullish(),
    condominium: z.string().transform(stringToFloat).nullish(),
    cableTV: z.string().transform(stringToFloat).nullish(),
    streamingServices: z.string().transform(stringToFloat).nullish(),
    fuel: z.string().transform(stringToFloat).nullish(),
    annualIPVA: z.string().transform(stringToFloat).nullish(),
    annualIPTU: z.string().transform(stringToFloat).nullish(),
    financing: z.string().transform(stringToFloat).nullish(),
    annualIR: z.string().transform(stringToFloat).nullish(),
    schoolTransport: z.string().transform(stringToFloat).nullish(),
    creditCard: z.string().transform(stringToFloat).nullish(),
    internet: z.string().transform(stringToFloat).nullish(),
    courses: z.string().transform(stringToFloat).nullish(),
    healthPlan: z.string().transform(stringToFloat).nullish(),
    medicationExpenses: z.string().transform(stringToFloat).nullish(),
    additionalExpenses: z.array(z.object({
        description: z.string().nullish(),
        value: z.string().transform(stringToFloat).nullish()
    }).nullish()).default([]),
    totalExpense: z.number().or(z.string().transform(stringToFloat)).nullish(),
    justifywaterSewage: z.string().nullish(),
    justifyelectricity: z.string().nullish(),
    justifylandlinePhone: z.string().nullish(),
    justifyfood: z.string().nullish(),
    justifyrent: z.string().nullish(),
    justifycondominium: z.string().nullish(),
    justifycableTV: z.string().nullish(),
    justifystreamingServices: z.string().nullish(),
    justifyfuel: z.string().nullish(),
    justifyannualIPVA: z.string().nullish(),
    justifyannualIPTU: z.string().nullish(),
    justifyfinancing: z.string().nullish(),
    justifyannualIR: z.string().nullish(),
    justifyschoolTransport: z.string().nullish(),
    justifycreditCard: z.string().nullish(),
    justifyinternet: z.string().nullish(),
    justifycourses: z.string().nullish(),
    justifyhealthPlan: z.string().nullish(),
    justifymedicationExpenses: z.string().nullish(),
})
    .superRefine((data, ctx) => {
        values.map(e => {
            if (!data?.[`justify${e}`]) {

                ctx.addIssue({
                    message: 'Justificativa obrigatória',
                    path: [`justify${e}`]
                })
            }
        })

    })
    .transform((data) => {
        let otherExpensesDescription = [];
        let otherExpensesValue = [];
        data.additionalExpenses.forEach((e) => {
            if (e.description && e.value) {
                otherExpensesDescription.push(e.description)
                otherExpensesValue.push(e.value)
            }
        })
        return { ...data, otherExpensesDescription, otherExpensesValue }
    })

export default expenseSchema