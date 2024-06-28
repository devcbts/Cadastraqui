const { z } = require("zod");

const passwordRecoverySchema = z.object({
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    passwordConfirm: z.string().min(1, 'Confirme sua senha')
}).superRefine((data, ctx) => {
    if (!!data.passwordConfirm && (data.password !== data.passwordConfirm)) {
        ctx.addIssue({
            message: 'Senhas não conferem',
            path: ['passwordConfirm']
        })
    }
})

export default passwordRecoverySchema