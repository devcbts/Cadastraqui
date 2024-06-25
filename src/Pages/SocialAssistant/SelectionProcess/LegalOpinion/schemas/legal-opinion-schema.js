const { z } = require("zod");

const legalOpinionSchema = z.object({
    additional: z.boolean(),
    file: z.instanceof(File).nullish(),
    status: z.string().min(1, 'Escolha um')
}).superRefine((data, ctx) => {
    if (data.additional && !data.file) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['file']
        })
    }
})
export default legalOpinionSchema