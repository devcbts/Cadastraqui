import APPLICATION_STATUS from "utils/enums/application-status";

const { z } = require("zod");

const legalOpinionSchema = z.object({
    hasAdditional: z.boolean(),
    additional: z.string().nullish(),
    status: z.enum(["Approved", "Rejected"])
}).superRefine((data, ctx) => {
    if (data.hasAdditional && !data.additional) {
        ctx.addIssue({
            message: 'Informação adicional obrigatória',
            path: ['additional']
        })
    }
})
export default legalOpinionSchema