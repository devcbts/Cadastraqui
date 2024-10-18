const { z } = require("zod");

const registerApplicantSchema = z.object({
    file: z.instanceof(File, 'Arquivo obrigatório').refine(e => !!e, 'Arquivo obrigatório'),
    // type: z.string().min(1, 'Ciclo de matrícula obrigatório'),
    // period: z.string().min(1, 'Período obrigatório'),
    modality: z.string().min(1, 'Modalidade obrigatória')
})
export default registerApplicantSchema