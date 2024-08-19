const { z } = require("zod");

const vehicleDataSchema = z.object({
    vehicleType: z.string().min(1, 'Tipo de veículo obrigatório'),
    modelAndBrand: z.string().min(1, 'Modelo e marca obrigatórios'),
    plate: z.string().min(1, 'Placa do veículo obrigatória'),
    document: z.string().min(1, 'Renavam obrigatório'),
    manufacturingYear: z.number({ message: 'Ano de fabricação obrigatório' }),
    usage: z.string().min(1, 'Uso do veículo obrigatório'),
    owners_id: z.array(z.string()).min(1, 'No mínimo 1 proprietário')
})

export default vehicleDataSchema