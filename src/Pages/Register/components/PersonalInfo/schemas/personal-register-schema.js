const { z } = require("zod");

const personalRegisterSchema = z.object({
    name: z.string().min(1, 'Nome obrigatório'),
    CPF: z.string().min(1, 'CPF obrigatório'),
    birthDate: z.string().date('Data inválida'),
    phone: z.string().min(1, 'Telefone obrigatório')
})

export default personalRegisterSchema