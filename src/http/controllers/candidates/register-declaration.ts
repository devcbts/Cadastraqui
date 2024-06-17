import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { Declaration_Type } from './enums/Declatarion_Type'



export async function registerDeclaration(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const DeclarationDataSchema = z.object({
    text: z.string().optional(),
    declarationExists: z.boolean(),
  })

  const DeclarationParamsSchema = z.object({
    _id: z.string(),
    type: Declaration_Type
  })

  // _id === family_member_id
  const { _id, type } = DeclarationParamsSchema.parse(request.params)

  const {
    declarationExists,
    text
  } = DeclarationDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub
    const IsUser = await SelectCandidateResponsible(user_id)
    if (!IsUser) {
      throw new NotAllowedError()
    }
    const CandidateOrResponsible = await SelectCandidateResponsible(_id)
    let idField = {}
    if (!CandidateOrResponsible) {
      const familyMember = await prisma.familyMember.findUnique({
        where: { id: _id },
      })
      if (!familyMember) {
        throw new ResourceNotFoundError()
      }
      idField = { familyMember_id: _id }
    }

    if (!declarationExists) {
      await prisma.declarations.create({
        data: {
          declarationType: type,
          ...(CandidateOrResponsible ? (CandidateOrResponsible.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : idField),
          declarationExists
        },
      
      })
    }
    // Store declaration information in the database
    if (text) {
      await prisma.declarations.create({
        data: {
          declarationType: type,
          text,
          ...(CandidateOrResponsible ? (CandidateOrResponsible.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : idField),
          declarationExists
        },
      })
    }


    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}