import { z } from "zod";

const maritalStatusSchema = z.object({
    maritalStatus: z.string().min(1, 'Estado civil obrigatório'),
    weddingCertificate: z.string().min(1, 'Arquivo obrigatório'),
}).refine(data =>
    data.maritalStatus === "Married" && data.weddingCertificate, { message: 'Certidão obrigatória', path: ["weddingCertificate"] })

export default maritalStatusSchema