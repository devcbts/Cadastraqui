const { z } = require("zod");

const userTypeSchema = z.object({
    role: z.string().min(1, 'Tipo de conta obrigatório'),
    terms: z.literal("accept"),
})

export default userTypeSchema