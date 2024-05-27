const { z } = require("zod");

const bankAccountSchema = z.object({
    bankName: z.string().min(1, 'Banco obrigatório'),
    accountNumber: z.string().min(1, 'Número da conta obrigatório'),
    agencyNumber: z.string().min(1, 'Agência obrigatória'),
    accountType: z.string().min(1, 'Tipo de conta obrigatória'),
})

export default bankAccountSchema