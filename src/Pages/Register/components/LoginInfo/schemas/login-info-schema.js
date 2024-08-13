const { z } = require("zod");

const loginInfoSchema = z.object({
    email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    passwordConfirmation: z.string().nullish()
}).superRefine((data, ctx) => {
    if (data.password && data.password !== data.passwordConfirmation) {
        ctx.addIssue({
            message: 'Senhas não conferem',
            path: ['passwordConfirmation']
        })
    }
})

export default loginInfoSchema