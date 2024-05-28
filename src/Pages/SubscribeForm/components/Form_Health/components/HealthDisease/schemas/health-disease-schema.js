const { z } = require("zod");

const healthDiseaseSchema = z.object({
    hasDisease: z.boolean(),
    disease: z.string(),
    specificDisease: z.string().nullish(),
    hasMedicalReport: z.boolean().nullish()
}).superRefine((data, ctx) => {
    if (data.hasDisease) {
        if (data.disease === 'specificDisease' && !data.specificDisease) {
            ctx.addIssue({
                message: 'Doença específica obrigatória',
                path: ["specificDisease"]
            })
        }
    }
})

export default healthDiseaseSchema