import { prisma } from "../lib/prisma";

// Função para normalizar o nome do curso
function normalizeName(name: string) {
    return name
        .normalize('NFD') // Normaliza para decompor caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .toLowerCase() // Converte para minúsculas
        .replace(/\s+/g, ''); // Remove espaços
}

/*async function updateEducationLevelCourseId() {
    try {
        // Buscar todos os registros na tabela EducationLevel
        const educationLevels = await prisma.educationLevel.findMany({
            where : {
                OR: [{offeredCourseType: {not: null}}, {basicEduType: {not: null}}]
            }
        });

        for (const educationLevel of educationLevels) {
            const { basicEduType, offeredCourseType, availableCourses,grade } = educationLevel;

            if (availableCourses || grade) {
                const normalizedCourseName = normalizeName((availableCourses || grade)!);

                // Buscar o curso na tabela Course
                const course = await prisma.course.findUnique({
                    where: {
                        normalizedName_Type: {
                            normalizedName: normalizedCourseName,
                            Type: (basicEduType || offeredCourseType) as AllEducationType
                        }
                    }
                });

                if (course) {
                    // Atualizar o campo courseId na tabela EducationLevel
                    await prisma.educationLevel.update({
                        where: { id: educationLevel.id },
                        data: { courseId: course.id }
                    });
                    console.log(`EducationLevel ${educationLevel.id} atualizado com courseId ${course.id}`);
                } else {
                    console.log(`Curso não encontrado para EducationLevel ${educationLevel.id}`);
                }
            }
        }

        console.log("Todos os registros de EducationLevel foram atualizados com sucesso.");
    } catch (error) {
        console.error("Erro ao atualizar EducationLevel:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o script
updateEducationLevelCourseId();
*/