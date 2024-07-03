const { z } = require("zod");

const vehicleSituationSchema = z.object({
    situation: z.string().min(1, 'Situação do veículo obrigatória'),
    financedMonths: z.number({ invalid_type_error: "Meses financiados obrigatório" }).nullish(),
    monthsToPayOff: z.number({ invalid_type_error: "Meses para quitação obrigatório" }).nullish(),
}).superRefine((data, ctx) => {
    if (data.situation === "Financed" && !data.financedMonths) {
        ctx.addIssue({
            message: "Meses financiados obrigatório",
            path: ["financedMonths"]
        })
    }
    if (data.situation === "Financed" && !data.monthsToPayOff) {
        ctx.addIssue({
            message: "Meses para quitação obrigatório",
            path: ["monthsToPayOff"]
        })
    }
})

export default vehicleSituationSchema