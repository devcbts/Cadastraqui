const { z } = require("zod");

const subsidiaryModalSchema = z.object({
    CEP: z.string().min(1, 'CEP obrigatório'),
    address: z.string().min(1, 'Rua obrigatória'),
    addressNumber: z.number({ invalid_type_error: 'Número obrigatório' }),
    city: z.string().min(1, 'Cidade obrigatória'),
    UF: z.string().min(1, 'UF obrigatória'),
    socialReason: z.string().min(1, 'Razão social obrigatória'),
    educationalInstitutionCode: z.string().min(1, 'Código institucional obrigatório')

})

export default subsidiaryModalSchema