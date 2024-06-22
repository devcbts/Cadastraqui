const { z } = require("zod")

const announcementInfoSchema = z.object({
    announcementType: z.string().min(1, 'Tipo de edital obrigatório'),
    educationLevel: z.string().min(1, 'Tipo de educação obrigatório'),
    openDate: z.string().date('Data inválida'),
    closeDate: z.string().date('Data inválida'),
    announcementDate: z.string().date('Data inválida'),
    announcementBegin: z.string().date('Data inválida'),
    waitingList: z.boolean(),
    hasInterview: z.boolean(),
    announcementName: z.string().min(1, 'Campo obrigatório'),
}).superRefine((data, ctx) => {
    if (data.announcementDate < data.announcementBegin) {
        ctx.addIssue({
            message: 'Data de fechamento deve ser maior que a de abertura',
            path: ['announcementDate']
        })
    }
    if (data.openDate < data.announcementBegin) {
        ctx.addIssue({
            message: 'Abertura de inscrições deve ser maior que a abertura do edital',
            path: ['openDate']
        })
    }
    if (data.closeDate < data.openDate) {
        ctx.addIssue({
            message: 'Término de inscrições deve ser maior que o início',
            path: ['closeDate']
        })
    }
})

export default announcementInfoSchema