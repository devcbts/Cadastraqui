const { z } = require("zod");

const assistantSchema = z.object({
    name: z.string().min(1, 'Nome obrigatório'),
    phone: z.string().min(1, 'Telefone obrigatório'),
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
    password: z.string().min(1, 'Senha obrigatória'),
    CPF: z.string().min(1, 'CPF obrigatório'),
    RG: z.string().min(1, 'RG obrigatório'),
    CRESS: z.string().min(1, 'CRESS obrigatório'),
})

export default assistantSchema