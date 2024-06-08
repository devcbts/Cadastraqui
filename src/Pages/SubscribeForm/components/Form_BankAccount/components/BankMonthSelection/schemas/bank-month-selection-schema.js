const { z } = require("zod");
// transform the data to use it inside createFileForm function
// we need to send the data to that function as an object with ({file_NAMETOSAVE: FILE})
const bankMonthSelectionSchema = z.object({
    months: z.array(z.object({
        date: z.date().or(z.string().transform(v => new Date(v))).default(new Date()),
        file_statement: z.instanceof(File).nullish(),
        url_statement: z.string().nullish(),
        isUpdated: z.boolean().default(false),
    }).superRefine((data, ctx) => {
        if (!data.file_statement && !data.url_statement) {
            ctx.addIssue({
                message: 'Arquivo obrigatório',
                path: ['file_statement']
            })
        }
        if (!data.isUpdated) {
            ctx.addIssue({
                message: 'Mês desatualizado',
                path: ['isUpdated']
            })
        }
    })
    ).min(3)
}).transform((data) => {
    const { months } = data
    const formattedObject = months.reduce((acc, month) => {
        const currMonth = month.date.getMonth() + 1
        const currYear = month.date.getFullYear()
        if (!month.url_statement) {
            acc[`file_${currMonth}-${currYear}`] = month.file_statement
        }
        return acc
    }, {})
    return formattedObject
})

export default bankMonthSelectionSchema