import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import metadataSchema from "utils/file/metadata-schema";
import { z } from "zod";

const benefitsSchema = z.object({
    enrolledGovernmentProgram: z.string().optional(),
    NIS: z.string().nullish(),
    attendedPublicHighSchool: z.boolean().default(false),
    benefitedFromCebasScholarship_basic: z.boolean().default(false),
    benefitedFromCebasScholarship_professional: z.boolean().default(false),
    CadUnico: z.boolean().default(false),
    file_registerProof: z.instanceof(File).nullish(),
    url_registerProof: z.string().nullish(),
    metadata_registerProof: metadataSchema,
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
        if (!data.file_registerProof) {
            ctx.addIssue({
                message: 'Arquivo obrigatório',
                path: ['file_registerProof']
            })
        }
    }
})
    .transform(e => {
        if (e.file_registerProof) {
            return {
                ...e,
                metadata_registerProof: {
                    type: METADATA_FILE_TYPE.DOCUMENT.REGISTERPROOF
                }
            }
        }
        return e
    })

export default benefitsSchema