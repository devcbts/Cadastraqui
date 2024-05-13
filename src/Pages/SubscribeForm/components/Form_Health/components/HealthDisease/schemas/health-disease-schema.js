const { z } = require("zod");

const healthDiseaseSchema = z.object({
    disease: z.string(),
    specificDisease: z.string().nullish(),
    hasMedicalReport: z.boolean()
}).refine((data) => data.disease !== 'specificDisease' || data.specificDisease, { message: 'Doença específica obrigatória', path: ["specificDisease"] })

export default healthDiseaseSchema