const { z } = require("zod");

const entityProfileSchema = z.object({
    email: z.string().email('Email inválido'),
    name: z.string().optional(),
    socialReason: z.string().min(1, 'Razão social obrigatória'),
    CNPJ: z.string().min(1, 'CNPJ obrigatório'),
    CEP: z.string().min(1, 'CEP obrigatório'),
    address: z.string().min(1, 'Rua obrigatória'),
    addressNumber: z.number({ invalid_type_error: 'Número obrigatório' }),
    neighborhood: z.string().min(1, 'Bairro obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    UF: z.string().min(1, 'UF obrigatória'),
})

export default entityProfileSchema