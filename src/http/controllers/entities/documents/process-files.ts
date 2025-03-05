import { APIError } from "@/errors/api-error"
import { Multipart } from "@fastify/multipart"
import { EntityDocumentType } from "@prisma/client"
import { randomUUID } from "crypto"
import { buffer } from "stream/consumers"
import { z } from "zod"

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
    const schema = z.object({
        buffer: z.instanceof(Buffer, { message: 'Arquivo obrigatório' }).nullish().refine(v => !(!isUpdate && v?.length === 0), 'Arquivo obrigatório'),
        name: z.string().optional(), // if not present, means file (buffer) is null
        metadata: z.object({
            type: z.string().optional().refine((value) => !(!isUpdate && !value), 'Tipo do metadata obrigatório'),
            category: z.string().optional(),
            document: z.string().optional().refine((value) => {
                return !(groupFile && !value)
            }, 'Campo documento do metadata obrigatório')
        }).optional().refine((v) => !(!isUpdate && !v), 'Metadata obrigatório'),
        group: z.string().optional(),
        fields: z.record(z.any()).optional(),
        type: z.enum(Object.values(EntityDocumentType) as [string, ...string[]])
            .optional()
            .refine((value) => !(!isUpdate && !value), 'Tipo/seção de arquivo obrigatóro'),
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
        const { success, error } = schema.safeParse(files[item])
        if (!success) {
            console.log(error)
            throw new APIError(error.issues.map(e => e.message).join(','))
        }
    }
    return files
}