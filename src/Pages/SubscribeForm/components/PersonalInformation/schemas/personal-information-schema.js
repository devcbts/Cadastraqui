import { z } from "zod";

const personalInformationSchema = z.object({
    skinColor: z.string().min(1, 'Cor de pele obrigatória'),
    educationLevel: z.string().min(1, 'Escolaridade obrigatória'),
    religion: z.string().min(1, 'Religião obrigatória'),
    specialNeeds: z.boolean(),
    specialNeedsDescription: z.string().nullish(),
    specialNeedsType: z.string().nullish(),
}).superRefine((data, ctx) => {
    if (data.specialNeeds) {
        if (!data.specialNeedsDescription) {

            ctx.addIssue({
                message: 'Descrição das necessidades especiais obrigatória',
                path: ['specialNeedsDescription']
            })
        }
        if (!data.specialNeedsType) {

            ctx.addIssue({
                message: 'Tipo das necessidades especiais obrigatória',
                path: ['specialNeedsType']
            })
        }
    }
})

export default personalInformationSchema