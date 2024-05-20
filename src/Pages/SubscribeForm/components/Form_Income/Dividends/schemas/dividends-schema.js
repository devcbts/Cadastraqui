const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const dividendsSchema = z.object({
    proLabore: z.string().min(1, 'Valor do pró-labore obrigatório').transform(stringToFloat),
    dividends: z.string().min(1, 'Valor dos dividendos obrigatório').transform(stringToFloat),
})
export default dividendsSchema