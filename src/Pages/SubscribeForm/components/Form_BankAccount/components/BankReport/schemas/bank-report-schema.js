import metadataSchema from "utils/file/metadata-schema";

const { z } = require("zod");

const bankReportSchema = z.object({
    file_bankReport: z.instanceof(File).nullish(),
    url_bankReport: z.string().nullish(),
    metadata_bankReport: metadataSchema,
    file_pixKey: z.instanceof(File).nullish(),
    url_pixKey: z.string().nullish(),
    metadata_pixKey: metadataSchema,

}).superRefine((data, ctx) => {
    if (!data.file_bankReport) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['file_bankReport']
        })
    }
    if (!data.file_pixKey) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['file_pixKey']
        })
    }
})

export default bankReportSchema