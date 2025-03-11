import { AnnouncementNotExists } from "@/errors/announcement-not-exists-error"
import { EntityNotExistsError } from "@/errors/entity-not-exists-error"
import { NotAllowedError } from "@/errors/not-allowed-error"
import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function updateAnnouncement(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const updateBodySchema = z.object({
      entityChanged: z.boolean().optional(),
      branchChanged: z.boolean().optional(),
      announcementType: z.enum(['ScholarshipGrant', 'PeriodicVerification']).optional(),
      offeredVacancies: z.number().optional(),
      verifiedScholarships: z.number().optional(),
      announcementNumber: z.string().optional()
    })
  
    const {
      entityChanged,
      branchChanged,
      announcementType,
      offeredVacancies,
      verifiedScholarships,
      announcementNumber
    } = updateBodySchema.parse(request.body)
  
    const updateParamsSchema = z.object({
        announcement_id : z.string()
    })
    const {announcement_id} = updateParamsSchema.parse(request.params)


    try {
    
    
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcement_id },
      })
  
      
  
      if (!announcement ) {
        throw new AnnouncementNotExists()
      }
  
      // Fazer a verificação da entidade geradora do announcement
      const entityMatrix = await prisma.entity.findUnique({
        where: {user_id: request.user.sub }
      })
    
      if (!entityMatrix) {
        throw new NotAllowedError()
      }

      const dataToUpdate: Record<string, any> = {
        entityChanged,
        branchChanged,
        announcementType,
        offeredVacancies,
        verifiedScholarships,
        announcementNumber,
      }
  
      for (const key in dataToUpdate) {
        if (typeof dataToUpdate[key as keyof typeof dataToUpdate] === 'undefined') {
          delete dataToUpdate[key as keyof typeof dataToUpdate];
        }
      }
  
      await prisma.announcement.update({
        where: { id: announcement_id }, 
        data: dataToUpdate,
      })
  
      return reply.status(200).send()
    } catch (err: any) {
      if (err instanceof AnnouncementNotExists) {
        return reply.status(409).send({ message: err.message })
      }
      if (err instanceof NotAllowedError) {
        return reply.status(404).send({ message: err.message })
      }
      return reply.status(500).send({ message: err.message })
    }
  }
  