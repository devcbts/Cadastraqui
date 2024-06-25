const { z } = require("zod");

const entityAddressSchema = z.object({
    CEP: z.string().min(1, 'CEP obrigatório'),
    address: z.string().min(1, 'Rua obrigatória'),
    neighborhood: z.string().min(1, 'Bairro obrigatório'),
    addressNumber: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    UF: z.string().min(1, 'UF obrigatória'),
})

export default entityAddressSchema