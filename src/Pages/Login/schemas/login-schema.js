const { z } = require("zod");

const loginSchema = z.object({
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
    password: z.string().min(1, 'Senha obrigatória').min(6, 'Deve ter ao menos 6 caracteres')
})

export default loginSchema