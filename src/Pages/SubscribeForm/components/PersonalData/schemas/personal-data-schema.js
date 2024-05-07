import z from 'zod'
import { isValidCPF } from 'utils/validate-cpf'
const personalDataFormSchema = z.object({
    fullName: z.string().min(1, 'Nome obrigatório'),
    CPF: z.string().min(1, 'CPF obrigatório').refine(isValidCPF, 'CPF inválido'),
    birthDate: z.string().date('Data inválida'),
    email: z.string().email({ message: 'E-mail inválido' }).min(1, 'E-mail obrigatório'),
    phone: z.string().min(1, 'Telefone obrigatório'),
})

export default personalDataFormSchema