const { z } = require("zod");

const modelBInformationSchema = z.object({
    CNPJ: z.string().min(1, 'CNPJ obrigatório'),
    admissionDate: z.string().date('Data inválida'),
    position: z.string().min(1, 'Atividade exercida obrigatória'),
    payingSource: z.string().min(1, 'Fonte pagadora obrigatória'),
    payingSourcePhone: z.string(),
})

export default modelBInformationSchema