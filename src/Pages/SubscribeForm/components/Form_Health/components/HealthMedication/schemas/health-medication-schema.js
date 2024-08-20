import metadataSchema from "utils/file/metadata-schema";

const { z } = require("zod");

const healthMedicationSchema = z.object({
    controlledMedication: z.boolean(),
    medicationName: z.string().nullish(),
    obtainedPublicly: z.boolean().nullish(),
    specificMedicationPublicly: z.string().nullish(),
    file_medication: z.instanceof(File).nullish(),
}).superRefine((data, ctx) => {
    if (data.controlledMedication && !data.medicationName) {
        ctx.addIssue({
            message: 'Nome do medicamento obrigatório',
            path: ["medicationName"]
        })
    }
    if (data.controlledMedication && !data.file_medication) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ["file_medication"]
        })
    }
    if (data.obtainedPublicly && !data.specificMedicationPublicly) {
        ctx.addIssue({
            message: 'Nome dos medicamentos recebidos de rede pública obrigatórios',
            path: ["specificMedicationPublicly"]
        })
    }

})

export default healthMedicationSchema