import { NotAllowedError } from '@/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function updateCreditCardInfo(request: FastifyRequest, reply: FastifyReply) {
  const CreditCardDataSchema = z.object({
    id: z.string(),
    bankName: z.string().optional(),
    cardFlag: z.string().optional(),
    cardType: z.string().optional(),
    familyMemberName: z.string().optional(),
    invoiceValue: z.number().optional(),
    usersCount: z.number().optional(),
  });

  

  const updateData = CreditCardDataSchema.parse(request.body);

  try {
    // Verifica se o cartão de crédito existe e se está associado ao usuário correto
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new NotAllowedError()
    }
    const creditCard = await prisma.creditCard.findUnique({
        where: {id: updateData.id}
    })
    if (!creditCard) {
        throw new ResourceNotFoundError()
    }
    // Opcional: Verificar se o usuário tem permissão para atualizar este cartão de crédito
    // Isso pode envolver verificar se o cartão está associado ao usuário ou a um membro da família do usuário

    // Atualiza as informações do cartão de crédito no banco de dados
    await prisma.creditCard.update({
      where: { id: updateData.id },
      data: updateData,
    });

    return reply.status(200).send({ message: 'Informações do cartão de crédito atualizadas com sucesso.' });
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: err.message });
      }
      if (err instanceof NotAllowedError) {
        return reply.status(401).send({ message: err.message });
      }
    return reply.status(500).send({ message: 'Erro ao atualizar informações do cartão de crédito.' });
  }
}
