import z from 'zod'
import { isValidCPF } from 'utils/validate-cpf'
const personalDataFormSchema = z.object({
    fullName: z.string().min(1, 'Nome obrigatório'),
    CPF: z.string().min(1, 'CPF obrigatório').refine(isValidCPF, 'CPF inválido'),
    birthDate: z.string().date('Data inválida'),
    email: z.string().email({ message: 'E-mail inválido' }).min(1, 'E-mail obrigatório'),
    landlinePhone: z.string().min(1, 'Telefone obrigatório'),
    skinColor: z.string().min(1, 'Cor de pele obrigatória'),
    educationLevel: z.string().min(1, 'Escolaridade obrigatória'),
    religion: z.string().min(1, 'Religião obrigatória'),
    specialNeeds: z.boolean(),
    specialNeedsDescription: z.string().nullish(),
    specialNeedsType: z.string().nullish(),
}).superRefine((data, ctx) => {
    if (data.specialNeeds) {
        if (!data.specialNeedsDescription) {
            ctx.addIssue({
                message: 'Descrição das necessidades especiais obrigatória',
                path: ['specialNeedsDescription']
            })
        }
        if (!data.specialNeedsType) {
            ctx.addIssue({
                message: 'Tipo das necessidades especiais obrigatória',
                path: ['specialNeedsType']
            })
        }
    }
})

export default personalDataFormSchema