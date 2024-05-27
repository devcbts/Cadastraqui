const { z } = require("zod");

const formPasswordSchema = z.object({
    oldPassword: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    newPassword: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export default formPasswordSchema