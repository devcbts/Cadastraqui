import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import deleteAwsFile from '@/utils/delete-aws-file'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { Declaration_Type } from './enums/Declatarion_Type'



export async function registerDeclaration(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const DeclarationDataSchema = z.object({
    text: z.string().nullish(),
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
    const declarationInstanceOnDatabase = await prisma.declarations.findFirst({
      where: {
        declarationType: type,
        ...(CandidateOrResponsible ? (CandidateOrResponsible.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : idField),
      }
    })
    let status = 200;
    if (declarationInstanceOnDatabase) {
      await prisma.declarations.update({
        where: {
          id: declarationInstanceOnDatabase.id
        },
        data: {
          text,
          declarationExists
        }
      })
      // return reply.status(200).send({ message: 'Declaration updated successfully' })
    } else {
      status = 201

      // Store declaration information in the database

      await prisma.declarations.create({
        data: {
          declarationType: type,
          text,
          ...(CandidateOrResponsible ? (CandidateOrResponsible.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : idField),
          declarationExists
        },
      })
    }
    // Maybe change to a flag system after
    switch (type) {
      case 'WorkCard':
        // if declaration exists is true = file is not necessary, only declaration
        if (declarationExists) {
          await deleteAwsFile(IsUser.UserData.id, `CandidateDocuments/${IsUser.UserData.id}/declaracoes/${_id}/carteira-de-trabalho.pdf`)
        }
        break
      case 'MEI':
        // if declarationExists is false, it shouldn't upload the file (or remove if it exists)
        if (!declarationExists) {
          await deleteAwsFile(IsUser.UserData.id, `CandidateDocuments/${IsUser.UserData.id}/declaracoes/${_id}/MEI.pdf`)
        }
        break
      case 'IncomeTaxExemption':
        // if declarationExists is true = it shouldn't upload the file
        if (declarationExists) {
          await deleteAwsFile(IsUser.UserData.id, `CandidateDocuments/${IsUser.UserData.id}/declaracoes/${_id}/IR.pdf`)
        }
        break
    }


    return reply.status(status).send({ message: 'Declaration updated successfully' })
  } catch (err: any) {
    console.log(err)
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Membro da Familia não Encontrado" })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}