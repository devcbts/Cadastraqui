const { z } = require("zod");

const healthFileSchema = z.object({
    file_exam: z.instanceof(File).nullish()
}).superRefine((data, ctx) => {
    if (!data.file_exam) {
        ctx.addIssue({
            message: 'Arquivo obrigatório',
            path: ['file_exam']
        })
    }
})

export default healthFileSchema