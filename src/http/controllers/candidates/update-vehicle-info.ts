import { NotAllowedError } from '@/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function updateVehicleInfo(request: FastifyRequest, reply: FastifyReply) {
    const vehicleUpdateSchema = z.object({
        id: z.string(),
        vehicleType: z.enum(['SmallCarsAndUtilities', 'TrucksAndMinibuses', 'Motorcycles']),
        modelAndBrand: z.string(),
        manufacturingYear: z.number(),
        situation: z.enum(['PaidOff', 'Financed']),
        financedMonths: z.number().optional().nullable(),
        monthsToPayOff: z.number().optional().nullable(),
        hasInsurance: z.boolean(),
        insuranceValue: z.number().optional().nullable(),
        usage: z.enum(['WorkInstrument', 'NecessaryDisplacement']),
        owners_id: z.array(z.string()),
        candidate_id: z.string().optional().nullable(),
    });

    const {
        id,
        vehicleType,
        modelAndBrand,
        manufacturingYear,
        situation,
        financedMonths,
        insuranceValue,
        monthsToPayOff,
        hasInsurance,
        usage,
        owners_id,
        candidate_id
    } = vehicleUpdateSchema.parse(request.body);

    try {
        const vehicle = await prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle) {
            throw new ResourceNotFoundError();
        }

        // Opcional: Verificar se o usuário tem permissão para atualizar este veículo
        // Se necessário, implemente a lógica de verificação aqui

        // Atualizando as informações do veículo
        await prisma.vehicle.update({
            where: { id },
            data: {
                vehicleType,
                modelAndBrand,
                manufacturingYear,
                situation,
                financedMonths,
                insuranceValue,
                monthsToPayOff,
                hasInsurance,
                usage,
                candidate: candidate_id ? { connect: { id: candidate_id } } : undefined,
                // Para atualizar os proprietários, precisamos de uma lógica adicional se owners_id for fornecido
            },
        });

        // Opcional: Atualizar relação com os proprietários, se necessário
        // Etapa 1: Buscar os proprietários atuais do veículo
        const currentOwners = await prisma.familyMemberToVehicle.findMany({
            where: { B: id }, // 'B' seria a coluna que relaciona com o ID do veículo
            select: { A: true } // 'A' seria a coluna que armazena o ID do proprietário (membro da família)
        });

        const currentOwnerIds = currentOwners.map(owner => owner.A);

        // Etapa 2: Identificar proprietários para adicionar e remover
        const ownersToAdd = owners_id.filter(ownerId => !currentOwnerIds.includes(ownerId));
        const ownersToRemove = currentOwnerIds.filter(ownerId => !owners_id.includes(ownerId));

        // Etapa 3: Atualizar o banco de dados
        // Inicia uma transação para garantir a atomicidade das operações
        await prisma.$transaction(async (prisma) => {
            // Verifica a existência dos proprietários antes de adicionar
            const existingOwners = await prisma.familyMember.findMany({
                where: {
                    id: {
                        in: ownersToAdd,
                    },
                },
            });
            const existingOwnerIds = existingOwners.map(owner => owner.id);

            // Adicionar novos proprietários que existem
            await Promise.all(existingOwnerIds.map(ownerId =>
                prisma.familyMemberToVehicle.create({
                    data: {
                        A: ownerId,
                        B: id,
                    },
                })
            ));

            // Remover proprietários que não estão mais na lista
            await Promise.all(ownersToRemove.map(ownerId =>
                prisma.familyMemberToVehicle.deleteMany({
                    where: {
                        A: ownerId,
                        B: id,
                    },
                })
            ));
        });



        return reply.status(200).send({ message: 'Informações do veículo atualizadas com sucesso.' });
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message });
        }
        // Capturar outros erros específicos ou genéricos conforme necessário
        return reply.status(500).send({ message: 'Erro ao atualizar informações do veículo.', err });
    }
}
