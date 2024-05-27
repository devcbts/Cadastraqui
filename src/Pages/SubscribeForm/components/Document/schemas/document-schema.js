import { z } from "zod";

const documentSchema = z.object({
    RG: z.string().min(1, 'RG obrigatório'),
    rgIssuingState: z.string().min(1, 'Estado emissor obrigatório'),
    rgIssuingAuthority: z.string().min(1, 'Órgão emissor obrigatório'),
    file_idDocument: z.instanceof(File).nullish(),
    url_idDocument: z.string().nullish(),
}).superRefine((data, ctx) => {
    if (!data.file_idDocument && !data.url_idDocument) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['file_idDocument']
        })
    }
})

export default documentSchema