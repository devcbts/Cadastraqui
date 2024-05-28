const { z } = require("zod");

const profileSchema = z.object({
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    passwordConfirmation: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export default profileSchema