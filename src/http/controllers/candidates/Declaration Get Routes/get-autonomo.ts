import { NotAllowedError } from "@/errors/not-allowed-error";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { IdentityDetails, IncomeSource } from '../../../../../backup_prisma/generated/clientBackup/index';
import { prisma } from "@/lib/prisma";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";


export default async function getAutonomo(
    request: FastifyRequest,
    reply: FastifyReply
){
    const declarationsParamsSchema = z.object({
        _id: z.string(),

    })

    const {_id} = declarationsParamsSchema.parse(request.params); 
  try {
    const user_id = request.user.sub;
    const isUser = await SelectCandidateResponsible(user_id);
    if (!isUser) {
        throw new NotAllowedError()
    }

    
    


    const infoDetails = await prisma.identityDetails.findFirst({
        where:{ OR: [{candidate_id: _id}, {responsible_id: _id}] },
        select: {
            fullName: true,
            CPF: true,
          
        }})
    const incomeDetails = await prisma.familyMemberIncome.findFirst({
        where: {OR: [{candidate_id: _id}, {legalResponsibleId: _id}], employmentType: 'SelfEmployed'},
    })
    if (!incomeDetails) {
        throw new ResourceNotFoundError()
    }
    if (!infoDetails) {
       
        const infoDetails = await prisma.familyMember.findUnique({
            where: {id: _id},
            select: {
                fullName: true,
                CPF: true,
                
            }
        })
        const incomeDetails = await prisma.familyMemberIncome.findFirst({
            where: {familyMember_id: _id, employmentType: 'SelfEmployed'},
        })
        if (!incomeDetails) {
            throw new ResourceNotFoundError()
        }
        return reply.status(200).send({...infoDetails, averageIncome: incomeDetails.averageIncome})

    }

    return reply.status(200).send({...infoDetails, averageIncome: incomeDetails.averageIncome})

  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({message: 'Resource not found'})
        
    }

    return reply.status(500).send({message: 'Internal server error'})
  }
}