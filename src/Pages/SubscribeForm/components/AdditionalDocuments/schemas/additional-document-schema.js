import { z } from "zod";

const additionalDocumentSchema = z.object({
    newDocument: z.boolean().default(false),
    documentType: z.string().nullish(),
    documentNumber: z.string().nullish(),
    documentValidity: z.string().refine(v => new Date(v), 'Data inválida').nullish()
}).superRefine((data, ctx) => {

    if (data.newDocument) {
        if (!data.documentNumber) {
            ctx.addIssue({
                message: 'Número obrigatório',
                path: ["documentNumber"]
            })
        }
        if (!data.documentValidity) {
            ctx.addIssue({
                message: 'Validade obrigatória',
                path: ["documentValidity"]
            })
        }
        if (!data.documentType) {
            ctx.addIssue({
                message: 'Tipo de documento obrigatório',
                path: ["documentType"]
            })
        }
    }
}, {})

export default additionalDocumentSchema