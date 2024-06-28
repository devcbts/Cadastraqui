const { z } = require("zod");

const legalOpinionSchema = z.object({
    hasAdditional: z.boolean(),
    additional: z.instanceof(File).or(z.string()).nullish(),
    status: z.string().min(1, 'Escolha um')
}).superRefine((data, ctx) => {
    if (data.hasAdditional && !data.additional) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['additional']
        })
    }
})
export default legalOpinionSchema