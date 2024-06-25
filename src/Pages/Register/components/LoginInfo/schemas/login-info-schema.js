const { z } = require("zod");

const loginInfoSchema = z.object({
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
})

export default loginInfoSchema