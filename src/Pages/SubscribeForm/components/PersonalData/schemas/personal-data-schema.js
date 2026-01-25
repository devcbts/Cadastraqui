import z from 'zod'
import { isValidCPF } from 'utils/validate-cpf'
import metadataSchema from "utils/file/metadata-schema"

const personalDataFormSchema = z.object({
    fullName: z.string().min(1, 'Nome obrigatório'),
    CPF: z.string().min(1, 'CPF obrigatório').refine(isValidCPF, 'CPF inválido'),
    birthDate: z.string().date('Data inválida'),
    email: z.string().email({ message: 'E-mail inválido' }).min(1, 'E-mail obrigatório'),
    landlinePhone: z.string().min(1, 'Telefone obrigatório'),
    RG: z.string().min(1, 'Documento obrigatório'),
    rgIssuingState: z.string().min(1, 'Estado emissor obrigatório'),
    rgIssuingAuthority: z.string().min(1, 'Órgão emissor obrigatório'),
    file_idDocument: z.instanceof(File).nullish(),
    url_idDocument: z.string().nullish(),
    metadata_idDocument: metadataSchema
}).superRefine((data, ctx) => {
    if (!data.file_idDocument && !data.url_idDocument) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['file_idDocument']
        })
    }
})

export default personalDataFormSchema