const { z } = require("zod");

const announcementBenefitsSchema = z.object({
    hasBenefits: z.boolean(),
    hasServices: z.boolean(),
    types1: z.array(z.string()).optional(),
    type2: z.string().nullish()
}).superRefine((data, ctx) => {
    if (data.hasBenefits && !data.types1.length) {
        ctx.addIssue({
            message: 'Selecione ao menos um benefício',
            path: ['types1']
        })
    }
    if (data.hasServices && !data.type2) {
        ctx.addIssue({
            message: 'Serviço(s) obrigatório(s)',
            path: ['type2']
        })
    }
})

export default announcementBenefitsSchema