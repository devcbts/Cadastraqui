const { z } = require("zod");

const subscribeFormSchema = z.object({
    id: z.string().min(1, 'Candidato obrigatório')
})

export default subscribeFormSchema