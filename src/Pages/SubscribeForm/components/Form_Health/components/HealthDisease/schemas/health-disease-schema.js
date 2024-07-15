const { z } = require("zod");

const healthDiseaseSchema = z.object({
    hasDisease: z.boolean(),
    disease: z.string(),
    specificDisease: z.string().nullish(),
    hasMedicalReport: z.boolean().nullish(),
    file_disease: z.instanceof(File).nullish()
}).superRefine((data, ctx) => {
    if (data.hasDisease) {
        if (data.disease === 'specificDisease' && !data.specificDisease) {
            ctx.addIssue({
                message: 'Doença específica obrigatória',
                path: ["specificDisease"]
            })
        }
    }
    if (data.hasMedicalReport) {
        if (!data.file_disease) {
            ctx.addIssue({
                message: 'Arquivo obrigatório',
                path: ['file_disease']
            })
        }
    }
})

export default healthDiseaseSchema