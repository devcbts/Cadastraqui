import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { calculateAge } from '@/utils/calculate-age'
import { normalizeString } from '../entities/utils/normalize-string'
import z from 'zod'

export async function deleteEnemScore(
	request: FastifyRequest,
	reply: FastifyReply,
) {

    const familyMemberParamsSchema = z.object({
        family_member_id: z.string().optional(),
    })
    const { family_member_id } = familyMemberParamsSchema.parse(request.params)
	try {
		const user_id = request.user.sub

		if (!user_id) {
			throw new NotAllowedError()
		}

		const candidateOrResponsible = await SelectCandidateResponsible(user_id)

		if (!candidateOrResponsible) {
			throw new ForbiddenError()
		}

		

		let candidateId: string | null = null

		if (family_member_id) {
			// Exclusão de ENEM de dependente (apenas responsável pode fazer)
			if (!candidateOrResponsible.IsResponsible) {
				throw new ForbiddenError()
			}

			const familyMember = await prisma.familyMember.findUnique({
				where: { id: family_member_id },
			})

			if (!familyMember) {
				throw new ResourceNotFoundError()
			}

			if (!familyMember.birthDate || !familyMember.CPF) {
				// Sem dados suficientes para vincular candidato/dependente
				candidateId = null
			} else {
				const age = calculateAge(new Date(familyMember.birthDate))

				if (age < 18) {
					const dependentCandidate = await prisma.candidate.findFirst({
						where: {
							AND: [
								{ CPF: normalizeString(familyMember.CPF) },
								{ responsible_id: candidateOrResponsible.UserData.id },
							],
						},
					})

					if (dependentCandidate) {
						candidateId = dependentCandidate.id
					}
				}
			}
		} else {
			// Exclusão de ENEM do próprio candidato (não responsável)
			if (candidateOrResponsible.IsResponsible) {
				throw new ForbiddenError()
			}

			candidateId = candidateOrResponsible.UserData.id as string
		}

		if (!candidateId) {
			// Nenhum candidato associado encontrado para exclusão
			return reply.status(204).send()
		}

		const existingEnem = await prisma.enemScore.findUnique({
			where: { candidate_id: candidateId },
		})

		if (!existingEnem) {
			// Nada para excluir: idempotente
			return reply.status(204).send()
		}

		await prisma.enemScore.delete({
			where: { candidate_id: candidateId },
		})

		return reply.status(204).send()
	} catch (err: any) {
		if (err instanceof ResourceNotFoundError) {
			return reply.status(404).send({ message: err.message })
		}
		if (err instanceof NotAllowedError) {
			return reply.status(401).send({ message: err.message })
		}
		if (err instanceof ForbiddenError) {
			return reply.status(403).send({ message: err.message })
		}

		return reply.status(500).send({ message: err.message })
	}
}

