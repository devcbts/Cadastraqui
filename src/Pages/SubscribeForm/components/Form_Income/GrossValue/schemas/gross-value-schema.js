import stringToFloat from "utils/string-to-float";

const { z } = require("zod");

const grossValueSchema = z.object({
    grossAmount: z.string({ invalid_type_error: 'Rendimentos obrigatórios' }).min(1, 'Rendimentos obrigatório').transform(stringToFloat)
})

export default grossValueSchema