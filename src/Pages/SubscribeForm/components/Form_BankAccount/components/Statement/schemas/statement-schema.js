const { z } = require("zod");

const statementSchema = z.object({
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
})

export default statementSchema