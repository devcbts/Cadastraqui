const { z } = require("zod");

const addressInfoSchema = z.object({
    address: z.string().min(1, 'Rua obrigatória'),
    addressNumber: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    UF: z.string().min(1, 'Estado obrigatório'),
    CEP: z.string().min(1, 'CEP obrigatório'),
    neighborhood: z.string().min(1, 'Bairro obrigatório'),
})

export default addressInfoSchema