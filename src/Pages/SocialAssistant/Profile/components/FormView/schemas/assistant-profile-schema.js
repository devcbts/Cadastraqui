import { isValidCPF } from "utils/validate-cpf";

const { z } = require("zod");

const assistantProfileSchema = z.object({
    name: z.string().nullish(),
    email: z.string().email().nullish(),
    CRESS: z.string().nullish(),
    CPF: z.string().refine(isValidCPF, 'CPF inválido').nullish(),
    phone: z.string().nullish(),
})

export default assistantProfileSchema