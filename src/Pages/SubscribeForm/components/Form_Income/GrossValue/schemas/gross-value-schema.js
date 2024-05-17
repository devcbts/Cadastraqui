import stringToFloat from "utils/string-to-float";

const { z } = require("zod");

const grossValueSchema = z.object({
    grossAmount: z.string('AQUI ERA OQ PORRA').min(1, 'Rendimentos obrigatório').transform(stringToFloat)
})

export default grossValueSchema