import { prisma } from "../lib/prisma";

async function updateEducationLevelEntityId() {
    try {
        // Buscar todos os registros na tabela Announcement
        const announcements = await prisma.announcement.findMany();

        for (const announcement of announcements) {
            const { id: announcementId } = announcement;

            // Buscar todos os registros na tabela EducationLevel onde entitySubsidiaryId é null e announcementId corresponde ao Announcement
            const educationLevels = await prisma.educationLevel.findMany({
                where: {
                    entitySubsidiaryId: null,
                    announcementId: announcementId
                }
            });

            for (const educationLevel of educationLevels) {
                const { id } = educationLevel;

                // Buscar a entidade matriz correspondente

                // Atualizar o campo entityId na tabela EducationLevel
                await prisma.educationLevel.update({
                    where: { id: id },
                    data: { entityId: announcement.entity_id }
                });
                console.log(`EducationLevel ${id} atualizado com entityId ${announcement.entity_id}`);

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
updateEducationLevelEntityId();