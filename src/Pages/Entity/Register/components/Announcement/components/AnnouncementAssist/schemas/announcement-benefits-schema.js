const { z } = require("zod");

const announcementBenefitsSchema = z.object({
    hasBenefits: z.boolean(),
    hasServices: z.boolean(),
    type1: z.array(z.string()).optional(),
    type2: z.string().nullish()
}).superRefine((data, ctx) => {
    if (data.hasBenefits && !data.type1.length) {
        ctx.addIssue({
            message: 'Selecione ao menos um benefício',
            path: ['type1']
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