import { isValidCPF } from "utils/validate-cpf";

const { z } = require("zod");

const lawyerSchema = z.object({
    name: z.string().min(1, 'Nome obrigatório'),
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
    password: z.string()
        .min(1, 'Senha obrigatória')
        .min(6, 'Deve ter pelo menos 6 caracteres'),
    CPF: z.string().min(1, 'CPF obrigatório').refine(isValidCPF, 'CPF inválido'),
})

export default lawyerSchema