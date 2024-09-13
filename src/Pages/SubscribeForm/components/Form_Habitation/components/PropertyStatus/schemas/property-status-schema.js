import metadataSchema from "utils/file/metadata-schema";

const { z } = require("zod");

const propertyStatusSchema = z.object({
    propertyStatus: z.string().min(1, 'Status da propriedade obrigatório'),
    grantorName: z.string().nullish(),
    contractType: z.string().nullish(),
    file_document: z.instanceof(File).nullish(),
    metadata_document: metadataSchema,
    url_document: z.string().nullish(),
    sign_housing: z.object({
        email: z.string().nullish(),
        file: z.instanceof(File).nullish()
    }),
}).superRefine((data, ctx) => {
    if (["ProvidedByEmployer", "ProvidedByFamily", "ProvidedOtherWay"].includes(data.propertyStatus) && !data.grantorName) {
        ctx.addIssue({
            message: 'Nome do cedente obrigatório',
            path: ["grantorName"]
        })
    }
    if (data.propertyStatus === "Rented" && !data.contractType) {
        ctx.addIssue({
            message: 'Tipo de contrato obrigatório',
            path: ["contractType"]
        })
    }
    if (["ProvidedByEmployer", "ProvidedByFamily", "ProvidedOtherWay", "Rented"].includes(data.propertyStatus)) {
        if (!data.file_document && !data.url_document) {
            ctx.addIssue({
                message: 'Documento obrigatório',
                path: ["file_document"]
            })
        }
    }
})

export default propertyStatusSchema