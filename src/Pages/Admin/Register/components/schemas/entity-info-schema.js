const { z } = require("zod");

const entityInfoSchema = z.object({
    name: z.string().min(1, 'Nome da instituição obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    CNPJ: z.string().min(1, 'CNPJ obrigatório'),
    socialReason: z.string().min(1, 'Razão social obrigatória'),
    // role: z.enum([ROLE.ENTITY]),
    educationalInstitutionCode: z.string().optional(),
    logo: z.instanceof(File, 'Arquivo obrigatório').refine((data) => data !== null, 'Logotipo da instituição obrigatória')
})

export default entityInfoSchema