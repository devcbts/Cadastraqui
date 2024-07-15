import { z } from "zod";

const benefitsSchema = z.object({
    enrolledGovernmentProgram: z.string().optional(),
    NIS: z.string().nullish(),
    attendedPublicHighSchool: z.boolean().default(false),
    benefitedFromCebasScholarship_basic: z.boolean().default(false),
    benefitedFromCebasScholarship_professional: z.boolean().default(false),
    CadUnico: z.boolean().default(false)
}).superRefine((data, ctx) => {
    if (data.CadUnico) {
        if (!data.NIS) {
            ctx.addIssue({
                message: 'NIS obrigatório',
                path: ['NIS']
            })
        }
        if (!data.enrolledGovernmentProgram) {
            ctx.addIssue({
                message: 'Programa governamental obrigatório',
                path: ['enrolledGovernmentProgram']
            })
        }
    }
})

export default benefitsSchema