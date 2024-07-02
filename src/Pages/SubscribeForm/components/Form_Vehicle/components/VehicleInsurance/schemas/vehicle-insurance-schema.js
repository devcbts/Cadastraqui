import stringToFloat from "utils/string-to-float";

const { z } = require("zod");

const vehicleInsuranceSchema = z.object({
    hasInsurance: z.boolean(),
    insuranceValue: z.string().nullish().transform(stringToFloat)
}).refine(data => !data.hasInsurance || data.insuranceValue, { message: 'Valor do seguro obrigatório', path: ["insuranceValue"] })

export default vehicleInsuranceSchema