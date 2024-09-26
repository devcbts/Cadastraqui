const { z } = require("zod");

const announcementCoursesSchema = z.object({
    level: z.string(),
    name: z.string().nullish(),
    id: z.number().nullish(),
    type: z.string().nullish(),
    typeOfScholarship: z.string().nullish(),
    verifiedScholarships: z.number({ invalid_type_error: 'Número de bolsas obrigatório' }).min(1, 'Não pode ser zero'),
    shift: z.string().min(1, 'Turno obrigatório'),
    semester: z.number().nullish(),
    entity_subsidiary_id: z.string().nullish().refine((data) => data === null || !!data, { message: 'Matriz ou filial obrigatória' }),
    courses: z.array(z.any()).nullish()
})
    .superRefine((data, ctx) => {
        if (data.level === 'BasicEducation') {
            if (!data.type) {
                ctx.addIssue({
                    message: 'Tipo de educação básica obrigatório',
                    path: ["type"]
                })
            }
            if (!data.name) {
                ctx.addIssue({
                    message: 'Ciclo/ano/série/curso obrigatório',
                    path: ["name"]
                })
            }
            if (!data.typeOfScholarship) {
                ctx.addIssue({
                    message: 'Tipo de bolsa obrigatório',
                    path: ['typeOfScholarship']
                })
            }
        } else {
            if (!data.typeOfScholarship) {
                ctx.addIssue({
                    message: 'Tipo de bolsa do ensino superior obrigatório',
                    path: ['typeOfScholarship']
                })
            }
            if (!data.type) {
                ctx.addIssue({
                    message: 'Tipo de curso oferecido obrigatório',
                    path: ["type"]
                })
            }
            if (!data.name) {
                ctx.addIssue({
                    message: 'Curso obrigatório',
                    path: ["name"]
                })
            }

            if (!data.semester) {
                ctx.addIssue({
                    message: 'Semestre obrigatório',
                    path: ['semester']
                })
            }
        }
    })

export default announcementCoursesSchema