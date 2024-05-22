const { z } = require("zod");

const modelDInformationSchema = z.object({
    admissionDate: z.string().date('Data inválida')
})

export default modelDInformationSchema