import { ENTITY_SUBTYPE_DOC, ENTITY_SUBTYPE_DOC_ZOD } from "@/utils/enums/entity-subtype-documents";
import { EntityDocumentType } from "@prisma/client";
import { z } from "zod";

export function validateMetadata(type?: EntityDocumentType) {
    const defaultMetadata = z.object({
        type: z.string().optional(),
        category: z.string().optional(),
        document: ENTITY_SUBTYPE_DOC_ZOD.optional()
    })


    let metadata;
    switch (type) {
        case 'MONTHLY_REPORT':
            const obj = z.object({
                year: z.number(),
                month: z.number()
                    .min(1, 'Não deve ser menor que 01 - Janeiro')
                    .max(12, 'Não deve ser maior que 12 - Dezembro')
            })
            metadata = defaultMetadata.merge(obj)
            break
        default:
            metadata = defaultMetadata
    }

    return metadata
}

export function validateFields(type?: EntityDocumentType, subtype?: ENTITY_SUBTYPE_DOC) {
    const defaultFields = z.record(z.any()).optional()
    let fields;
    switch (type) {
        case 'ELECTION_RECORD':
        case 'PROCURATION':
            fields = z.object({
                start: z.string().date('Data inválida'),
                end: z.string().date('Data inválida'),
            })
            break
        case 'DEBIT_CERTIFICATE':
        case 'FGTS':
        case 'CARE_PLAN':
            fields = z.object({
                issuedAt: z.string().date('Data inválida'),
                expireAt: z.string().date('Data inválida'),
            })
            break
        case 'ACCREDITATION_ACT':
            fields = z.object({
                name: z.string().min(1, 'Nome obrigatório'),
                cnpj: z.string().min(1, 'CNPJ obrigatório'),
            })
            break
        case 'ANNOUNCEMENT':
        case 'ACCOUNTING':
        case 'AUDIT_OPINION':
        case 'PARTNERSHIP_TERM':
        case 'ACTIVITY_REPORT':
        case 'PROFILE_ANALYSIS':
        case 'NOMINAL_RELATION':
        case 'NOMINAL_RELATION_TYPE_ONE':
        case 'NOMINAL_RELATION_TYPE_TWO':
        case 'GOVERNING_BODY':
        case 'MONITORING_REPORT':
            fields = z.object({
                year: z.number({ message: 'Ano obrigatório' }),
            })
            break
        case 'MONTHLY_REPORT':
            const obj = z.object({
                year: z.number(),
                month: z.number()
                    .min(1, 'Não deve ser menor que 01 - Janeiro')
                    .max(12, 'Não deve ser maior que 12 - Dezembro')
            })
            fields = obj
            break
        case 'CEBAS':
            if (subtype === 'CEBAS_CERTIFICATE') {
                fields = z.object({
                    issuedAt: z.string().date('Data inválida'),
                    expireAt: z.string().date('Data inválida'),
                })
                break;
            }
            if (subtype === 'CEBAS_EXTENSION') {
                fields = z.object({
                    expireAt: z.string().date('Data inválida'),
                })
                break;
            }
            fields = defaultFields
            break;
        default:
            fields = defaultFields
    }
    return fields
}