const { z } = require("zod");

const reportSchema = z.object({
    check_report: z.boolean(),
    file_report: z.instanceof(File).nullish()
})

export default reportSchema