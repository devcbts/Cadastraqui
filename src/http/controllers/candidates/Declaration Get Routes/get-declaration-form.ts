import { NotAllowedError } from "@/errors/not-allowed-error";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { IdentityDetails } from '../../../../../backup_prisma/generated/clientBackup/index';
import { prisma } from "@/lib/prisma";


export default async function getDeclarationForm(
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
            RG: true,
            CPF: true,
            rgIssuingAuthority: true,
            rgIssuingState: true,
            maritalStatus: true,
            profession: true,
            address: true,
            addressNumber: true,
            city: true,
            UF: true,
            email: true,
            documentValidity: true,
            documentType: true,
            documentNumber: true,
            CEP: true,
            neighborhood: true
        }})
    if (!infoDetails) {
        const candidateInfo =  await prisma.identityDetails.findFirst({
            where:{ OR: [{candidate_id:isUser.UserData.id}, {responsible_id:isUser.UserData.id}] },
            select: {
                address: true,
                addressNumber: true,
                city: true,
                UF: true,
                CEP: true,
                neighborhood: true
            }})
        const infoDetailsFamily = await prisma.familyMember.findUnique({
            where: {id: _id},
            select: {
                fullName: true,
                RG: true,
                CPF: true,
                rgIssuingAuthority: true,
                rgIssuingState: true,
                maritalStatus: true,
                profession: true,
                email: true,
                documentValidity: true,
                documentType: true,
                documentNumber: true,
            }
        })

        const infoToSend = {...candidateInfo, ...infoDetailsFamily}
        return reply.status(200).send({infoDetails: infoToSend})

    }

    return reply.status(200).send({infoDetails})

  } catch (error) {
    
  }
}