import { APIError } from "@/errors/api-error"
import { ENTITY_SUBTYPE_DOC } from "@/utils/enums/entity-subtype-documents"
import { Multipart } from "@fastify/multipart"
import { EntityDocumentType } from "@prisma/client"
import { randomUUID } from "crypto"
import { buffer } from "stream/consumers"
import { z } from "zod"
import { validateFields, validateMetadata } from "./validade-type-schema"

export default async function processFiles(parts: AsyncIterableIterator<Multipart>, opts: {
    groupFile?: boolean,
    isUpdate?: boolean
} = { isUpdate: false, groupFile: false }) {
    const files: Record<string, {
        buffer?: Buffer,
        fields?: object,
        metadata?: object,
        type?: EntityDocumentType,
        name?: string,
        group?: string
    }> = {}

    const { isUpdate, groupFile } = opts
    const commonSchema = z.object({
        buffer: z.instanceof(Buffer, { message: 'Arquivo obrigatório' })
            .optional()
            .refine(v => !(!isUpdate && v?.length === 0), 'Arquivo obrigatório'),
        name: z.string().optional(), // if not present, means file (buffer) is null
        // metadata: z.object({
        //     type: z.string().optional().refine((value) => !(!isUpdate && !value), 'Tipo do metadata obrigatório'),
        //     category: z.string().optional(),
        //     document: z.string().optional().refine((value) => {
        //         return !(groupFile && !value)
        //     }, 'Campo documento do metadata obrigatório')
        // })
        // metadata: metadata
        //     .catchall(z.string({ invalid_type_error: 'Metadados devem ser todos do tipo texto' }))
        //     .optional()
        //     .refine((v) => !(!isUpdate && !v), 'Metadata obrigatório')
        //     .refine(v => !(!isUpdate && groupFile && !v?.['document']), 'Subtipo do documento obrigatório')
        //     .refine(v => !(!isUpdate && !v?.['type']), 'Subtipo do documento obrigatório')
        //     .transform(x => {
        //         if (!x) {
        //             return undefined
        //         }
        //         return Object.entries(x).reduce((acc, [k, v]) => {
        //             acc[k] = String(v)
        //             return acc
        //         }, {} as Record<string, string>)
        //     }),
        // fields,
        group: z.string().optional(),
        // fields: z.record(z.any()).optional(),
        type: z.enum(Object.values(EntityDocumentType) as [string, ...string[]])
            .optional()
            .refine((value) => !(!isUpdate && !value), 'Tipo/seção de arquivo obrigatóro')
            .transform(x => !!x ? EntityDocumentType[x as keyof typeof EntityDocumentType] : undefined)
    })
    let groups: Record<string, string> = {}
    for await (const part of parts) {
        const index = part.fieldname.split('_').pop()
        if (!index) {
            continue
        }
        if (!files[index]) {
            files[index] = {
            }
        }
        const { type, mimetype } = part
        if (type === 'file') {
            files[index].buffer = await buffer(part.file)
            files[index].name = part.filename
        } else if (part.type === 'field') {
            if (!!part.fieldname.match(/^metadata_(\d+)$/)) {
                // validar o metadata baseado no tipo
                files[index].metadata = JSON.parse(part.value as string)
            }
            if (!!part.fieldname.match(/^group_(\d+)$/)) {
                const group = part.value as string
                if (!groups[group]) {
                    const uuid = randomUUID()
                    groups[group] = uuid
                }
                files[index].group = groups[group]
                files[index].fields = {
                    ...files[index].fields,
                    group: groups[group]
                }
            }
            if (!!part.fieldname.match(/^fields_(\d+)$/)) {
                // validar os fields baseado no tipo
                files[index].fields = JSON.parse(part.value as string)
            }
            if (!!part.fieldname.match(/^type_(\d+)$/)) {
                files[index].type = part.value as EntityDocumentType
            }
        }

    }
    for (const item in files) {
        const { success, error, data } = commonSchema.safeParse(files[item])
        getErrors(success, error)
        console.log('METADATAS')
        const metadata = validateMetadata(files[item].type)
        const { success: m_success, error: m_error, data: m_data } = metadata
            .catchall(z.string({ invalid_type_error: 'Metadados devem ser todos do tipo texto' }))
            .optional()
            .refine((v) => !(!isUpdate && !v), 'Metadata obrigatório')
            .refine(v => !(!isUpdate && groupFile && !v?.['document']), 'Subtipo do documento obrigatório')
            .refine(v => !(!isUpdate && !v?.['type']), 'Subtipo do documento obrigatório')
            .transform(x => {
                if (!x) {
                    return undefined
                }
                return Object.entries(x).reduce((acc, [k, v]) => {
                    acc[k] = String(v)
                    return acc
                }, {} as Record<string, string>)
            })
            .safeParse(files[item].metadata)
        getErrors(m_success, m_error)
        console.log('FIELDS')
        let fields = validateFields(files[item].type, m_data?.document as ENTITY_SUBTYPE_DOC)
        if (groupFile) {
            fields = fields.optional() as any
        }
        const { success: f_success, error: f_error, data: f_data } = fields.safeParse(files[item].fields)
        getErrors(f_success, f_error)
        files[item] = data!
        files[item].metadata = m_data!
        files[item].fields = f_data!
    }
    return files
}

const getErrors = (success: boolean, error?: z.ZodError) => {
    if (!success) {
        console.log(error)
        const message = [...new Set(error?.issues.map(e => e.message))].join(',')
        throw new APIError(message)
    }
    return
}