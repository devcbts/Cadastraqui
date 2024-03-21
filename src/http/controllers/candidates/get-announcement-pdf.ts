// Importações necessárias
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { getSignedUrlsFromUserFolder } from '@/lib/S3'; // Assumindo que esta função está implementada para obter a URL assinada
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
    console.log('rota acessada')
    const Folder = `Announcements/${announcement.entity_id}/${announcement_id}`;
    const url = await getSignedUrlsFromUserFolder(Folder); // Assumindo que esta função retorna a URL direta para o documento

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
