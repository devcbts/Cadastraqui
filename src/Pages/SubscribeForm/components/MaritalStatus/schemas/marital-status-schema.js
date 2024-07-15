import { z } from "zod";

const maritalStatusSchema = z.object({
    maritalStatus: z.string().min(1, 'Estado civil obrigatório'),
    file_statusCertificate: z.instanceof(File).nullish(),
    url_statusCertificate: z.string().nullish(),
})
// .refine(data => {
//     return (data.file_statusCertificate || data.url_statusCertificate)
// }, { message: 'Documento obrigatório', path: ["statusCertificate"] })

export default maritalStatusSchema