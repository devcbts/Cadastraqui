const { z } = require("zod");

const modelAInformationSchema = z.object({
    startDate: z.string().date('Data inválida'),
    position: z.string().min(1, 'Atividade exercida obrigatória')
})

export default modelAInformationSchema