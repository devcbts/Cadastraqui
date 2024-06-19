const { z } = require("zod");

const assistantSelectionSchema = z.object({
    assistant: z.string().min(1, 'Selecione um assistente')
})
export default assistantSelectionSchema