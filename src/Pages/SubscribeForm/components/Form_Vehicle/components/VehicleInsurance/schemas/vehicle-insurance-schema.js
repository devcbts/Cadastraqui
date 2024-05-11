const { z } = require("zod");

const vehicleInsuranceSchema = z.object({
    hasInsurance: z.boolean(),
    insuranceValue: z.number().nullish()
}).refine(data => !data.hasInsurance || data.insuranceValue, { message: 'Valor do seguro obrigatório', path: ["insuranceValue"] })

export default vehicleInsuranceSchema