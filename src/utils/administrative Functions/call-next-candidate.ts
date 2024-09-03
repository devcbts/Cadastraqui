import { Prisma } from "@prisma/client"

export default async function callNextCandidate(educationLevel_id: string, tsPrisma: Prisma.TransactionClient){
    // Make the first application which status is WaitingList or Reserve to Holder
    const firstApplicationWaitingList = await tsPrisma.application.findFirstOrThrow({
        where: {educationLevel_id, candidateStatus:{
            in: ['WaitingList','Reserve']
        }},

        orderBy:{
            position: 'asc'
        }
    })
    

   await tsPrisma.application.update({
        where: {id: firstApplicationWaitingList.id},
        data: {
            candidateStatus: 'Holder',
            applicationHistories: {
                create:{
                    description: "Inscrição Atualizada, você foi convocado para a chamada regular",
                }
            }
        }
    })
}