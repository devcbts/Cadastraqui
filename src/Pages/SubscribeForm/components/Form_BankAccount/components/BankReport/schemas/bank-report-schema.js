const { z } = require("zod");

const bankReportSchema = z.object({
    file_bankReport: z.instanceof(File).nullish(),
    url_bankReport: z.string().nullish(),
}).superRefine((data, ctx) => {
    if (!data.file_bankReport && !data.url_bankReport) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['file_bankReport']
        })
    }
})

export default bankReportSchema