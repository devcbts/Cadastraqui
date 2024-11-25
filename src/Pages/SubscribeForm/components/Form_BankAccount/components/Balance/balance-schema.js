const { default: stringToFloat } = require("utils/string-to-float");
const { z } = require("zod");

const balanceSchema = z.object({
    balanceid: z.string().nullish(),
    initialBalance: z.string().or(z.number()).transform(stringToFloat).refine(e => e > 0, 'Saldo inicial obrigatório'),
    entryBalance: z.string().or(z.number()).transform(stringToFloat).refine(e => e > 0, 'Total de entradas obrigatório'),
    outflowBalance: z.string().or(z.number()).transform(stringToFloat).refine(e => e > 0, 'Total de saídas obrigatório'),
    totalBalance: z.string().or(z.number()).transform(stringToFloat).refine(e => e > 0, 'Saldo total obrigatório'),
})

export default balanceSchema