const { z } = require("zod")

const announcementInfoSchema = z.object({
    announcementType: z.string().min(1),
    educationLevel: z.string().min(1),
    file: z.instanceof(FileList).refine((value) => value.length === 1, 'Arquivo obrigatório').refine((value) => {
        const [file] = value
        return file?.type === "application/pdf"
    }, { message: 'Apenas arquivos PDF' }),
    offeredVancancies: z.number().int().optional(),
    verifiedScholarships: z.number().int().optional(),
    openDate: z.date({
        errorMap: (issue, { defaultError }) => ({
            message: issue.code === "invalid_date" ? "Data inválida" : defaultError,
        }),
    }),
    closeDate: z.date({
        errorMap: (issue, { defaultError }) => ({
            message: issue.code === "invalid_date" ? "Data inválida" : defaultError,
        }),
    }),
    announcementDate: z.date({
        errorMap: (issue, { defaultError }) => ({
            message: issue.code === "invalid_date" ? "Data inválida" : defaultError,
        }),
    }),
    announcementBegin: z.date({
        errorMap: (issue, { defaultError }) => ({
            message: issue.code === "invalid_date" ? "Data inválida" : defaultError,
        }),
    }),
    description: z.string().optional(),
    waitingList: z.boolean().default(false),
    hasInterview: z.boolean(),
    announcementInterview: z.object({
        startDate: z.date({
            errorMap: (issue, { defaultError }) => ({
                message: issue.code === "invalid_date" ? "Data inválida" : defaultError,
            }),
        }).min(new Date(), "Data não pode ser menor que o dia atual"),
        endDate: z.date({
            errorMap: (issue, { defaultError }) => ({
                message: issue.code === "invalid_date" ? "Data inválida" : defaultError,
            }),
        }).min(new Date(), "Data não pode ser menor que o dia atual"),
        duration: z.number().int().default(20),
        beginHour: z.string(),
        endHour: z.string(),
        interval: z.number().int().default(5)
    }),
    announcementName: z.string().min(1, 'Campo obrigatório'),
    selectedCursos: z.array().optional(),
})

export default announcementInfoSchema