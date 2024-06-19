const { z } = require("zod");

const announcementCoursesSchema = (isBasicEducation) => z.object({
    level: z.string(),
    basicEduType: z.string().nullish(),
    scholarshipType: z.string().nullish(),
    higherEduScholarshipType: z.string().nullish(),
    offeredCourseType: z.string().nullish(),
    availableCourses: z.string().nullish(),
    offeredVacancies: z.number().default(0).nullish(),
    verifiedScholarships: z.number({ invalid_type_error: 'Número de bolsas obrigatório' }).min(1, 'Não pode ser zero'),
    shift: z.string().min(1, 'Turno obrigatório'),
    grade: z.string().nullish(),
    semester: z.number().nullish(),
    entity_subsidiary_id: z.string().nullish().refine((data) => data === null || !!data, { message: 'Matriz ou filial obrigatória' }),
    courses: z.array(z.any()).nullish()
})
    .superRefine((data, ctx) => {
        if (isBasicEducation) {
            if (!data.basicEduType) {
                ctx.addIssue({
                    message: 'Tipo de educação básica obrigatório',
                    path: ['basicEduType']
                })
            }
            if (!data.grade) {
                ctx.addIssue({
                    message: 'Ciclo/ano/série/curso obrigatório',
                    path: ['grade']
                })
            }
            if (!data.scholarshipType) {
                ctx.addIssue({
                    message: 'Tipo de bolsa obrigatório',
                    path: ['scholarshipType']
                })
            }
        } else {
            if (!data.higherEduScholarshipType) {
                ctx.addIssue({
                    message: 'Tipo de bolsa do ensino superior obrigatório',
                    path: ['higherEduScholarshipType']
                })
            }
            if (!data.offeredCourseType) {
                ctx.addIssue({
                    message: 'Tipo de curso oferecido obrigatório',
                    path: ['offeredCourseType']
                })
            }
            if (!data.availableCourses) {
                ctx.addIssue({
                    message: 'Curso obrigatório',
                    path: ['availableCourses']
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