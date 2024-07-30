
import { historyDatabase, prisma } from '@/lib/prisma';
import getOpenApplications from './find-open-applications';
import { findAWSRouteHDB } from './Handle Application/find-AWS-Route';
import { copyFilesToAnotherFolder } from '@/lib/S3';
import calculateDistance from '@/utils/Trigger-Functions/search-distance';

/// HDB == HistoryDataBase
export async function createIdentityDetailsHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const findIdentityDetails = await prisma.identityDetails.findUnique({
        where: {
            id,
        },
    })
    if (!findIdentityDetails) {
        return null;
    }
    const { id: identityId, candidate_id: mainCandidateId, responsible_id: responsible_id, ...identityDetails } = findIdentityDetails;


    const newId = await historyDatabase.idMapping.findFirst({
        where: { mainId: (mainCandidateId || responsible_id)!, application_id }

    })
    const idField = mainCandidateId ? { candidate_id: newId?.newId } : { responsible_id: newId?.newId };

    const createIdentityDetails = await historyDatabase.identityDetails.create({
        data: { main_id: identityId, ...identityDetails, ...idField, application_id }
    });
    const idRoute = mainCandidateId ? candidate_id : legalResponsibleId;
    if (!idRoute) {
        return null;
    }
    const route = `CandidateDocuments/${idRoute}/identity/${idRoute}/`;
    const RouteHDB = await findAWSRouteHDB(idRoute, 'identity', idRoute, null, application_id)
    await copyFilesToAnotherFolder(route, RouteHDB)

}
export async function updateIdentityDetailsHDB(id: string) {
    const findIdentityDetails = await prisma.identityDetails.findUnique({
        where: {
            id,
        },
    });
    if (!findIdentityDetails) {
        return null;
    }
    const { id: identityId, candidate_id: mainCandidateId, responsible_id: mainResponsibleId, ...identityDetails } = findIdentityDetails;

    if (!mainCandidateId && !mainResponsibleId) {
        return null;
    }
    let openApplications
    if (mainCandidateId) {
        openApplications = await getOpenApplications(mainCandidateId);

    }
    if (mainResponsibleId) {
        openApplications = await getOpenApplications(mainResponsibleId);
    }

    if (!openApplications) {
        return null;
    }
    const candidateLocation = `${findIdentityDetails.address}, ${findIdentityDetails.addressNumber}, ${findIdentityDetails.neighborhood}, ${findIdentityDetails.city}, ${findIdentityDetails.UF}, ${findIdentityDetails.CEP}`
    for (const application of openApplications) {
        const identityDetailsHDB = await historyDatabase.identityDetails.findUnique({
            where: { application_id: application.id }
        })
        if (!identityDetailsHDB) {
            return null;
        }

        
        const candidateApplicationLocation = `${identityDetailsHDB.address}, ${identityDetailsHDB.addressNumber}, ${identityDetailsHDB.neighborhood}, ${identityDetailsHDB.city}, ${identityDetailsHDB.UF}, ${identityDetailsHDB.CEP}`
        // Verifica se teve alguma alteração no endereço
        if (candidateApplicationLocation != candidateLocation) {
            await prisma.$transaction(async (tsPrisma) => {
                
                // Primeiro atualizar a tabela no banco de dados de histórico
                const updateIdentityDetails = await historyDatabase.identityDetails.update({
                    where: { main_id: identityId, application_id: application.id },
                    data: { ...identityDetails },
                });

                // Pegar informações sobre a vaga
                const educationLevel = await tsPrisma.educationLevel.findUnique({
                    where: { id: application.educationLevel_id },
                    include: { announcement: true }
                });
                if (!educationLevel) {
                    return null;
                }
                // Descobrir qual a matriz ou filial que a vaga se refere
                const entityInfo = educationLevel.entitySubsidiaryId ? await tsPrisma.entitySubsidiary.findUnique({
                    where: { id: educationLevel.entitySubsidiaryId }
                }) : await tsPrisma.entity.findUnique({
                    where: { id: educationLevel.announcement.entity_id }
                });

                if (!entityInfo) {
                    return null;
                }
                
                const entityLocation = entityInfo.address ? `${entityInfo.address}, ${entityInfo.addressNumber}, ${entityInfo.neighborhood}, ${entityInfo.city}, ${entityInfo.UF}, ${entityInfo.CEP}` : '';
                // calcular a distância
                const distance = await calculateDistance(candidateLocation, entityLocation);

                await tsPrisma.application.update({
                    where: { id: application.id },
                    data: { distance, CadUnico: identityDetails.CadUnico }
                });
            });
        }

    }


}