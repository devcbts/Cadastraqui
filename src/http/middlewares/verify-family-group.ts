import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function verifyFamilyGroup(request: FastifyRequest, reply: FastifyReply){
    const declarationsParamsSchema = z.object({
        _id: z.string(),

    })

    const {_id} = declarationsParamsSchema.parse(request.params); 
    const user_id = request.user.sub;
    const isUser = await SelectCandidateResponsible(user_id);
    if (!isUser) {
       return reply.status(403).send({ message: 'Unauthorized access.' })
    }
    const familyMember = await prisma.familyMember.findUnique({
        where: {id: _id},
    })
    
    const matchId = familyMember?.candidate_id === isUser.UserData.id || familyMember?.legalResponsibleId === isUser.UserData.id || _id === isUser.UserData.id;
    if (!matchId) {
        return reply.status(403).send({ message: 'Unauthorized access' })
        
    }

}