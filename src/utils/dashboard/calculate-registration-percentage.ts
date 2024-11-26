import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "../select-candidate-responsible";
const percentages = {
    cadastrante: 20,
    grupoFamiliar: 20,
    moradia: 5,
    veiculos: 5,
    rendaMensal: 20,
    despesas: 10,
    saude: 5,
    declaracoes: 15,
    documentos: 0
};
export default async function calculateRegistrationPercentage (candidateOrResponsibleId: string,announcement_id:string){

    const candidateOrResponsible = await SelectCandidateResponsible(candidateOrResponsibleId)
    if (!candidateOrResponsible) {
        return null
    }
    const registration = await prisma.finishedRegistration.findUnique({
        where: {candidate_id_legalResponsibleId: {candidate_id: candidateOrResponsible.IsResponsible ? '':candidateOrResponsible.UserData.id as string  ,legalResponsibleId : !candidateOrResponsible.IsResponsible ? '':candidateOrResponsible.UserData.id as string} }
    })

    if (!registration) {
        return null;
    }

  
    
    let totalPercentage = 0;

    for (const [key, value] of Object.entries(percentages)) {
        if (registration[key as keyof typeof registration]) {
            totalPercentage += value;
        }
    }
    
    const percentage = totalPercentage;

    await prisma.announcementsSeen.updateMany({
        where : { OR: [{candidate_id: candidateOrResponsibleId}, {responsible_id: candidateOrResponsibleId}] 
    ,announcement: {
        closeDate : {gt: new Date()}
    }
        }
        ,
        data: {
            percentage
        }
    }
)

}