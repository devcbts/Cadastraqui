import { z } from "zod";

const maritalStatusSchema = z.object({
    maritalStatus: z.string().min(1, 'Estado civil obrigatório'),
    weddingCertificate: z.instanceof(File).nullish(),
}).refine(data => {
    if (data.maritalStatus !== "Married") { return true; }
    return (data.maritalStatus === "Married" && data.weddingCertificate)
}, { message: 'Certidão obrigatória', path: ["weddingCertificate"] })

export default maritalStatusSchema