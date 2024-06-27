import { z } from "zod";

const personalInformationSchema = z.object({
    skinColor: z.string().min(1, 'Cor de pele obrigatória'),
    educationLevel: z.string().min(1, 'Escolaridade obrigatória'),
    religion: z.string().min(1, 'Religião obrigatória'),
    specialNeeds: z.boolean(),
    specialNeedsDescription: z.string().nullish(),
}).superRefine((data, ctx) => {
    if (data.specialNeeds && !data.specialNeedsDescription) {
        ctx.addIssue({
            message: 'Descrição das necessidades especiais obrigatória',
            path: ['specialNeedsDescription']
        })
    }
})

export default personalInformationSchema