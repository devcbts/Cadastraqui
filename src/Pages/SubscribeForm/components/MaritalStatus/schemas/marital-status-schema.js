import { z } from "zod";

const maritalStatusSchema = z.object({
    maritalStatus: z.string().min(1, 'Estado civil obrigatório'),
    file_weddingCertificate: z.instanceof(File).nullish(),
    url_weddingCertificate: z.string().nullish(),
}).refine(data => {
    if (data.maritalStatus !== "Married") { return true; }
    return (data.maritalStatus === "Married" && (data.file_weddingCertificate || data.url_weddingCertificate))
}, { message: 'Certidão de casamento obrigatória', path: ["weddingCertificate"] })

export default maritalStatusSchema