const { z } = require("zod");

const propertyOwnerSchema = z.object({
    ownerName: z.string().min(1, 'Nome do proprietário obrigatório'),
    RG: z.string().min(1, 'RG obrigatório'),
    documentIssuing: z.string().min(1, 'Órgão emissor obrigatório'),
    ufIssuing: z.string().min(1, 'UF do órgão emissor obrigatória'),
    CPF: z.string().min(1, 'CPF obrigatório'),
    nationality: z.string().min(1, 'Nacionalidade obrigatória'),
    UF: z.string().min(1, 'Naturalidade obrigatória'),
    maritalStatus: z.string().min(1, 'Estado civil obrigatório'),
    profession: z.string().min(1, 'Profissão obrigatória'),
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
})

export default propertyOwnerSchema