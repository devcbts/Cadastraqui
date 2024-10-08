import { prisma } from "../lib/prisma";

async function deleteEducationLevelsWithNullCourseId() {
    try {
        // Buscar todos os registros na tabela EducationLevel onde courseId é null
        const educationLevels = await prisma.educationLevel.findMany({
            where: {
               // courseId: null
            },
            select: {
                id: true
            }
        });

        // Deletar todos os registros relacionados na tabela ScholarshipGranted
        const educationLevelIds = educationLevels.map(el => el.id);
        const applications = await prisma.application.findMany({
            where: {
                educationLevel_id: {
                    in: educationLevelIds
                }
            },
            select: {
                id: true
            }
        });
        const applicationIds = applications.map(app => app.id);
        await prisma.scholarshipGranted.deleteMany({
            where: {
                application_id: {
                    in: applicationIds
                }
            }
        });

        // Deletar todos os registros relacionados na tabela Application
        await prisma.application.deleteMany({
            where: {
                educationLevel_id: {
                    in: educationLevelIds
                }
            }
        });

        // Deletar todos os registros na tabela EducationLevel onde courseId é null
        const result = await prisma.educationLevel.deleteMany({
            where: {
                id: {
                    in: educationLevelIds
                }
            }
        });

        console.log(`${result.count} registros de EducationLevel foram deletados com sucesso.`);
    } catch (error) {
        console.error("Erro ao deletar registros de EducationLevel:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o script
deleteEducationLevelsWithNullCourseId();