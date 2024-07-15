import { isValidCPF } from "utils/validate-cpf";
import { z } from "zod";

export default z.object({
    rentValue: z.string().min(1, 'Valor do aluguel obrigatório'),
    landlordCpf: z.string().min(1, 'CPF obrigatório').refine(isValidCPF, 'CPF inválido'),
    landlordName: z.string().min(1, 'Nome obrigatório')
})