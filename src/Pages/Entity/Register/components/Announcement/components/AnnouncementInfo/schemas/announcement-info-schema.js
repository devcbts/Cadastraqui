const { z } = require("zod")

const announcementInfoSchema = z.object({
    announcementType: z.string().min(1, 'Tipo de edital obrigatório'),
    educationLevel: z.string().min(1, 'Tipo de educação obrigatório'),
    // file: z.instanceof(FileList).refine((value) => value.length === 1, 'Arquivo obrigatório').refine((value) => {
    //     const [file] = value
    //     return file?.type === "application/pdf"
    // }, { message: 'Apenas arquivos PDF' }),
    // offeredVancancies: z.number().int().optional(),
    // verifiedScholarships: z.number().int().optional(),
    openDate: z.string().date('Data inválida'),
    closeDate: z.string().date('Data inválida'),
    announcementDate: z.string().date('Data inválida'),
    announcementBegin: z.string().date('Data inválida'),
    // description: z.string().optional(),
    waitingList: z.boolean(),
    hasInterview: z.boolean(),
    // announcementInterview: z.object({}).nullish(),
    announcementName: z.string().min(1, 'Campo obrigatório'),
    // selectedCursos: z.array().optional(),
})

export default announcementInfoSchema