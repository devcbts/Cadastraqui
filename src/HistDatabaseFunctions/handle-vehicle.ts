import { prisma } from '@/lib/prisma';
import { historyDatabase } from '@/lib/prisma';
import getOpenApplications from './find-open-applications';
import { findAWSRouteHDB } from './Handle Application/find-AWS-Route';
import { copyFilesToAnotherFolder } from '@/lib/S3';

export async function createVehicleHDB(id: string, candidate_id: string | null, legalResponsibleId: string | null, application_id: string) {
    const findVehicle = await prisma.vehicle.findUnique({
        where: {
            id,
        },
    });
    if (!findVehicle) {
        return null;
    }
    const { id: vehicleId, candidate_id: mainCandidateId, legalResponsibleId: mainResponsibleId, owners_id: oldOwnersIds, ...vehicleDetails } = findVehicle;

    const newId = await historyDatabase.idMapping.findFirst({
        where: { mainId: (mainCandidateId || mainResponsibleId)!, application_id }
    
    })
   const idField = mainCandidateId ? { candidate_id: newId?.newId } : { legalResponsibleId: newId?.newId };

    const newOwnersIds = [];
    for (const ownerId of oldOwnersIds) {
        const idMapping = await historyDatabase.idMapping.findFirst({
            where: {
                mainId: ownerId,
                application_id
            },
        });
        if (idMapping) {
            newOwnersIds.push(idMapping.newId);
        }
    }

    const updatedVehicleDetails = {
        ...vehicleDetails,
        owners_id: newOwnersIds,
    };

    const createVehicle = await historyDatabase.vehicle.create({
        data: { main_id: vehicleId, ...updatedVehicleDetails, ...idField, application_id },
    });

    const route = `CandidateDocuments/${candidate_id || legalResponsibleId || ''}/vehicle/${candidate_id || legalResponsibleId || ''}/${vehicleId}`;
    const RouteHDB = await findAWSRouteHDB(candidate_id || legalResponsibleId || '', 'vehicle', candidate_id || legalResponsibleId || '', vehicleId, application_id);
    await copyFilesToAnotherFolder(route, RouteHDB);
}

export async function updateVehicleHDB(id: string) {
    const findVehicle = await prisma.vehicle.findUnique({
        where: {
            id,
        },
    });
    if (!findVehicle) {
        return null;
    }
    const { id: vehicleId, candidate_id: mainCandidateId, legalResponsibleId: mainResponsibleId, owners_id: oldOwnersIds, ...vehicleDetails } = findVehicle;


    if (!mainCandidateId && !mainResponsibleId) {
        return null;
    }
    let openApplications;
    if (mainCandidateId) {
        openApplications = await getOpenApplications(mainCandidateId);
    }
    if (mainResponsibleId) {
        openApplications = await getOpenApplications(mainResponsibleId);
    }
    if (!openApplications) {
        return null;
    }

    for (const application of openApplications) {
        const newOwnersIds = [];
        for (const ownerId of oldOwnersIds) {
            const idMapping = await historyDatabase.idMapping.findFirst({
                where: {
                    mainId: ownerId,
                    application_id: application.id
                },
            });
            if (idMapping) {
                newOwnersIds.push(idMapping.newId);
            }
        }

        const updatedVehicleDetails = {
            ...vehicleDetails,
            owners_id: newOwnersIds,
        };
        await historyDatabase.vehicle.updateMany({
            where: { main_id: vehicleId, application_id: application.id },
            data: { ...updatedVehicleDetails },
        });
    }
}