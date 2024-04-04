// Importações necessárias
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { GetUrl } from '@/http/services/get-file';
import { prisma } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getAnnouncementDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    announcement_id: z.string(),
  });

  const { announcement_id } = requestParamsSchema.parse(request.params);

  try {
    // Verifica se o edital existe
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcement_id },

    });

    if (!announcement) {
      throw new ResourceNotFoundError();
    }
    const Folder = `Announcemenets/${announcement.entity_id}/${announcement_id}.pdf`;
    const url = await GetUrl(Folder); // Assumindo que esta função retorna a URL direta para o documento

    if (!url) {
      throw new ResourceNotFoundError();
    }

    return reply.status(200).send({ url });
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    return reply.status(500).send({ message: 'Erro interno do servidor.' });
  }
}
