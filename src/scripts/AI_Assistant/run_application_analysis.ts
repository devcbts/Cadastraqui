import { historyDatabase, prisma } from "@/lib/prisma";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { createThread } from "./create_thread";
import { section } from "@/http/controllers/social-assistant/enums/Section";
import { initializeThread } from "./initialize_thread";
import { runThread } from "./run_thread";
import * as fs from 'fs';

export async function runApplicationAnalysis(application_id: string) {
    const application = await prisma.application.findUniqueOrThrow({
        where: { id: application_id }
    })

    const candidateOrResponsibleHDB = await SelectCandidateResponsibleHDB(application_id);

    const familyMembers = await historyDatabase.familyMember.findMany({
        where: { application_id }
    })
    const membersIds = familyMembers.map((member) => member.id);
    membersIds.push(candidateOrResponsibleHDB?.UserData.id);


    await memberDataAnalysis(candidateOrResponsibleHDB?.UserData.id);
    /*membersIds.map(async (member_id) => {
        await memberDataAnalysis(member_id);
    })*/
}



const sections = [
    //'statement',
    'identity',
    //'health',
    //'income',
    //"registrato",
    //'pix'

] as section[]

async function memberDataAnalysis(member_id: string) {

    try {
        sections.forEach(async (section) => {
            let table_id = null;
            if (section === 'income') {
                const income = await historyDatabase.familyMemberIncome.findMany({
                    where: { application_id: '135deb2d-3710-4337-8e68-3824964eaa0d', OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }] }
                })
                for (const incomeData of income) {
                    table_id = incomeData.id;
                    
                    await createThread('135deb2d-3710-4337-8e68-3824964eaa0d', section, member_id, table_id)
                    
                    await initializeThread('135deb2d-3710-4337-8e68-3824964eaa0d', section, member_id, table_id)
                    
                    
                    const { myMessages } = await runThread('135deb2d-3710-4337-8e68-3824964eaa0d', section, member_id,table_id);
                    const filePath = `${__dirname}/messages_${member_id}_${section}_${table_id}.json`;
                    fs.writeFileSync(filePath, JSON.stringify(myMessages, null, 2));
                }
            }
            else {

                await createThread('135deb2d-3710-4337-8e68-3824964eaa0d', section, member_id, table_id)

                await initializeThread('135deb2d-3710-4337-8e68-3824964eaa0d', section, member_id, table_id)


                const { myMessages } = await runThread('135deb2d-3710-4337-8e68-3824964eaa0d', section, member_id,table_id);
                const filePath = `${__dirname}/messages_${member_id}_${section}.json`;
                fs.writeFileSync(filePath, JSON.stringify(myMessages, null, 2));
            }

            // Escrever os dados de messages em um arquivo JSON

        })
    } catch (error) {
        console.error("Error:", error);
    }
}