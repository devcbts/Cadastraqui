const { z } = require("zod");

const bankMonthSelectionSchema = z.object({
    months: z.array(z.object({
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
})

export default bankMonthSelectionSchema