import { z } from "zod";

const additionalDocumentSchema = z.object({
    newDocument: z.string(),
    documentType: z.string(),
    documentNumber: z.string(),
    documentValidity: z.string().date('Data inválida')
}).refine(data => {
    return !(data.newDocument && (!data.documentType || !data.documentValidity || !data.documentNumber))
}, { message: 'Campo obrigatório', path: ["documentType", "documentNumber", "documentValidity"] })

export default additionalDocumentSchema