import { z } from "zod";

const benefitsSchema = z.object({
    enrolledGovernmentProgram: z.boolean().default(false),
    NIS: z.string().nullish(),
    attendedPublicHighSchool: z.boolean().default(false),
    benefitedFromCebasScholarship_basic: z.boolean().default(false),
    benefitedFromCebasScholarship_professional: z.boolean().default(false),
    CadUnico: z.boolean().default(false)
}).refine((data) => !data.CadUnico || data.NIS, { message: "NIS obrigatório", path: ["NIS"] })

export default benefitsSchema