
import { NotAllowedError } from '@/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function updateFinancingInfo(request: FastifyRequest, reply: FastifyReply) {
  // Define o esquema para o tipo de financiamento
  const FinancingType = z.enum([
    'Car',
    'Motorcycle',
    'Truck',
    'House_Apartment_Land',
    'Other'
  ]);

  // Define o esquema para os dados de financiamento
  const FinancingDataSchema = z.object({
    id: z.string(),
    bankName: z.string(),
    familyMemberName: z.string(),
    installmentValue: z.number(),
    totalInstallments: z.number(),
    paidInstallments: z.number(),
    financingType: FinancingType,
    otherFinancing: z.string().optional().nullable(),
  });

  // Define o esquema para os parâmetros da requisição

  // Extrai os dados do corpo da requisição
  const updateData = FinancingDataSchema.parse(request.body);

  try {
    // Verifica se o financiamento existe e se está associado ao usuário correto
   
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

   

    // Opcional: Adicionar verificação para garantir que o usuário atual tenha permissão para atualizar este financiamento

    // Atualiza as informações do financiamento no banco de dados
    await prisma.financing.update({
      where: { id: updateData.id },
      data: updateData,
    });

    return reply.status(200).send({ message: 'Informações de financiamento atualizadas com sucesso.' });
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message });
    }

    return reply.status(500).send({ message: err.message });
  }
}
