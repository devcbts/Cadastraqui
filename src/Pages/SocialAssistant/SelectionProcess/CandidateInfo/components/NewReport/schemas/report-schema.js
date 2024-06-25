const { z } = require("zod");

const reportSchema = z.object({
    date: z.string().date('Data inválida'),
    file: z.instanceof(File, 'Arquivo obrigatório').refine((data) => data !== null, 'Arquivo obrigatório'),
})

export default reportSchema