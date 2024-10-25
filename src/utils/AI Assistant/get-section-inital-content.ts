import { historyDatabase } from '@/lib/prisma';
import { section } from '../../http/controllers/social-assistant/enums/Section';
export default async function getSectionInitalContent(sectionToSearch : section, application_id: string) {


    switch (sectionToSearch) {
        case "identity":
            const identityDetails = await historyDatabase.identityDetails.findUniqueOrThrow({
                where: { application_id }
            })

            const content = `Os dados de identidade são: ${JSON.stringify(identityDetails)}. Cruze eles com os dados dos arquivos e verifique inconsistências, principalmente em dados que são observados tanto no JSON quanto nos documentos`
            return content;
        case "family-member":
            const familyMembers = await historyDatabase.familyMember.findMany({
                where: { application_id }
            })

            const contentFamilyMembers = `Os membros da família são: ${JSON.stringify(familyMembers)}. Verifique se os dados de cada um dos familiares está condizente com os documentos. Além disso verifique se os documentos estão condizentes com o que eles propõem.
            Os arquivos de cada membro virão associados no padrão (id do membro)_(nome do arquivo).pdf. Seja bem detalhista na análise`
            return contentFamilyMembers;
        case "housing":
            const housingDetails = await historyDatabase.housing.findUniqueOrThrow({
                where: { application_id }
            })

            const contentHousing = `Os dados de moradia são: ${JSON.stringify(housingDetails)}. Verifique se os dados estão condizentes com os documentos`
            return contentHousing;
        default:
            return "Nenhum conteúdo encontrado"
    }
}