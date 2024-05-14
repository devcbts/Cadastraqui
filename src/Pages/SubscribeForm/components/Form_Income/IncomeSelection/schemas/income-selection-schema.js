const { z } = require("zod");

const incomeSelectionSchema = z.object({
    incomeSource: z.string().min(1, 'Fonte de renda obrigatória')
})

export default incomeSelectionSchema