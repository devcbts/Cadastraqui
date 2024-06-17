const { z } = require("zod");

const responsibleSchema = z.object({
    name: z.string().min(1, 'Nome obrigatório'),
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
    phone: z.string().min(1, 'Telefone obrigatório'),
    CPF: z.string().min(1, 'CPF obrigatório'),
    password: z.string().min(1, 'Senha obrigatória')
})

export default responsibleSchema