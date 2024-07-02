import { isValidCPF } from "utils/validate-cpf";

const { z } = require("zod");

const personalRegisterSchema = z.object({
    name: z.string().min(1, 'Nome obrigatório'),
    CPF: z.string().min(1, 'CPF obrigatório').refine(isValidCPF, 'CPF inválido'),
    birthDate: z.string().date('Data inválida'),
    // phone: z.string().min(1, 'Telefone obrigatório')
})

export default personalRegisterSchema