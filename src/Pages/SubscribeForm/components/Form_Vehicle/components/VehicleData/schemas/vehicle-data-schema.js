import { z } from 'zod'
import { isValidPlate } from 'utils/validate-plate'
import { isValidRenavam } from 'utils/validate-renavam'

const currentYear = new Date().getFullYear()
const MIN_VEHICLE_YEAR = 1900

const vehicleDataSchema = z.object({
    vehicleType: z.string().min(1, 'Tipo de veículo obrigatório'),
    modelAndBrand: z.string().min(1, 'Modelo e marca obrigatórios'),
    plate: z.string()
        .min(1, 'Placa do veículo obrigatória')
        .transform((value) => (value || '').toUpperCase().trim())
        .refine(isValidPlate, 'Placa inválida. Verifique o formato (padrão antigo ou Mercosul).'),
    document: z.string()
        .min(1, 'Renavam obrigatório')
        .refine(isValidRenavam, 'Renavam inválido. Deve conter 9 ou 11 dígitos numéricos.'),
    manufacturingYear: z.coerce.number({ invalid_type_error: 'Ano de fabricação obrigatório' })
        .int({ message: 'Ano de fabricação inválido' })
        .min(MIN_VEHICLE_YEAR, `Ano mínimo ${MIN_VEHICLE_YEAR}`)
        .max(currentYear, `Ano máximo ${currentYear}`),
    usage: z.string().min(1, 'Uso do veículo obrigatório'),
    owners_id: z.array(z.string()).min(1, 'No mínimo 1 proprietário')
})

export default vehicleDataSchema