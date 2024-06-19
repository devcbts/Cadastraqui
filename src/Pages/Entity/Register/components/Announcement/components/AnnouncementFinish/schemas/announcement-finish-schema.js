const { z } = require("zod");

const announcementFinishSchema = z.object({
    criteria: z.array(z.string()).min(1, 'Pelo menos um critério deve ser escolhido'),
    file: z.instanceof(File).refine((data) => data !== null, 'Arquivo obrigatório'),
    description: z.string().min(1, 'Descrição obrigatória')
})

export default announcementFinishSchema