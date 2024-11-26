import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import sendEmail from "@/http/services/send-email";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function answerSolicitation(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    solicitation_id: z.string(),
  });
  const { solicitation_id } = paramsSchema.parse(request.body);

  try {
    const user_id = request.user.sub;
    const CandidateOrResponsible = await SelectCandidateResponsible(user_id);
    if (!CandidateOrResponsible) {
      throw new ForbiddenError();
    }

    const solicitation = await prisma.requests.findUnique({
      where: { id: solicitation_id },
      include: {
        application: {
          include: {
            announcement: true,
            SocialAssistant: {
                include: {
                    user: true
                }
            }, // Certifique-se de que este relacionamento existe
          },
        },
      },
    });

    if (!solicitation) {
      throw new ResourceNotFoundError();
    }

    // Verifica se o usuário tem permissão para responder a esta solicitação
    const isAllowedToAnswer = CandidateOrResponsible.IsResponsible
      ? solicitation.application.responsible_id === CandidateOrResponsible.UserData.id
      : solicitation.application.candidate_id === CandidateOrResponsible.UserData.id;
    if (!isAllowedToAnswer) {
      throw new ForbiddenError();
    }

    await prisma.requests.update({
      where: { id: solicitation_id },
      data: {
        answered: true,
      },
    });

    // Enviar email à assistente social
    if (!solicitation.application.SocialAssistant) {
      throw new Error('Assistente social não encontrado');
        
    }
    const socialAssistantEmail = solicitation.application.SocialAssistant.user.email;
    const socialAssistantName = solicitation.application.SocialAssistant.name;
    const applicationNumber = solicitation.application.number;
    const announcementName = solicitation.application.announcement.announcementName;

    sendEmail({
      subject: 'Solicitação Respondida',
      to: socialAssistantEmail,
      body: `
        <h1>A solicitação referente à inscrição Nº${applicationNumber} foi respondida</h1>
        <p>Olá ${socialAssistantName},</p>
        <p>A solicitação referente ao edital ${announcementName} e inscrição Nº${applicationNumber} foi respondida.</p>
        <p>
          <a href="https://www.cadastraqui.com.br/">Clique aqui</a> para acessar o sistema e visualizar a resposta.
        </p>
      `,
      createdBy: 'Candidate',
      user_id: solicitation.application.SocialAssistant.user.id,
    })
      .then((v) => console.log('Email enviado', v))
      .catch((err) => console.error('Erro ao enviar email', err));

    return reply.status(200).send({ message: "Solicitação respondida com sucesso" });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return reply.status(403).send({ message: error.message });
    }
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    // Outros erros potenciais
    return reply.status(500).send({ message: "Ocorreu um erro ao responder a solicitação" });
  }
}