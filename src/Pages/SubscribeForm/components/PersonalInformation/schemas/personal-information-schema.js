import { z } from "zod";

const personalInformationSchema = z.object({
    skinColor: z.string().min(1, 'Cor de pele obrigatória'),
    educationLevel: z.string().min(1, 'Escolaridade obrigatória'),
    specialNeeds: z.boolean().default(false),
})

export default personalInformationSchema