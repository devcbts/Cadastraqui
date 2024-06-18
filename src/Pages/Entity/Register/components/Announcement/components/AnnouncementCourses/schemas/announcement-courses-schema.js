const { z } = require("zod");

const announcementCoursesSchema = (isBasicEducation) => z.object({
    level: z.string(),
    basicEduType: z.string().optional(),
    scholarshipType: z.string().optional(),
    higherEduScholarshipType: z.string().optional(),
    offeredCourseType: z.string().optional(),
    availableCourses: z.string().optional(),
    offeredVacancies: z.string().optional(),
    verifiedScholarships: z.string().min(1, 'Número de bolsas obrigatório'),
    shift: z.string().min(1, 'Turno obrigatório'),
    grade: z.string().optional(),
    semester: z.string().optional(),
    entity_subsidiary_id: z.string().nullish().refine((data) => data === null || !!data, { message: 'Matriz ou filial obrigatória' }),
    courses: z.array(z.any()).optional()
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