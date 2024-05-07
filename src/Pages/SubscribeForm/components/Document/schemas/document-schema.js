import { z } from "zod";

const documentSchema = z.object({
    RG: z.string().min(1, 'RG obrigatório'),
    rgIssuingState: z.string().min(1, 'Estado emissor obrigatório'),
    rgIssuingAuthority: z.string().min(1, 'Órgão emissor obrigatório'),
    document: z.instanceof(File, { message: 'Documento inválido' }).refine(value => value, { message: 'Arquivo obrigatório' }),

})

export default documentSchema