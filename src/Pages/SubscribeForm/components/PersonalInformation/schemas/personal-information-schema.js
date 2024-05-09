import { z } from "zod";

const personalInformationSchema = z.object({
    skinColor: z.string().min(1, 'Cor de pele obrigatória'),
    educationLevel: z.string().min(1, 'Escolaridade obrigatória'),
    religion: z.string().min(1, 'Religião obrigatória'),
    specialNeeds: z.boolean(),
})

export default personalInformationSchema