const { z } = require("zod");

const subsidiarySchema = z.object({
    // name: z.string().min(1,'obrigatório'),
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
    CEP: z.string().min(1, 'CEP obrigatório'),
    CNPJ: z.string().min(1, 'CNPJ obrigatório'),
    educationalInstitutionCode: z.string().min(1, 'Código educacenso obrigatório'),
    socialReason: z.string().min(1, 'Razão social obrigatória'),
    address: z.string().min(1, 'Rua obrigatória'),
    addressNumber: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    UF: z.string().min(1, 'UF obrigatória'),
    neighborhood: z.string().min(1, 'Bairro obrigatório'),
})

export default subsidiarySchema