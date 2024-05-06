import z from 'zod'
import validateCEP from '../../../../../../utils/validate-cep'

export const addressDataSchema = z.object({
    CEP: z.string().min(1, 'CEP obrigatório').refine(validateCEP, 'CEP inválido'),
    address: z.string().min(1, 'Rua obrigatória'),
    addressNumber: z.string().min(1, 'Número obrigatório').refine((value) => !isNaN(Number(value)), 'Apenas números'),
    UF: z.string().min(1, 'Estado obrigatório'),
    neighborhood: z.string().min(1, 'Bairro obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória')
})