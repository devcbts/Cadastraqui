import { z } from "zod";

export default z.object({
    mei: z.boolean(),
    file: z.instanceof(File).nullish()
}).superRefine((data, ctx) => {
    if (data.mei) {
        if (!data.file) {
            ctx.addIssue({
                message: 'Arquivo obrigatório',
                path: ['file']
            })
        }
    }
})