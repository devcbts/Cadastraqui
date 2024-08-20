import metadataSchema from "utils/file/metadata-schema";

const { z } = require("zod");

const bankReportSchema = z.object({
    file_bankReport: z.instanceof(File).nullish(),
    url_bankReport: z.string().nullish(),
    metadata_bankReport: metadataSchema
}).superRefine((data, ctx) => {
    if (!data.file_bankReport) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['file_bankReport']
        })
    }
})

export default bankReportSchema