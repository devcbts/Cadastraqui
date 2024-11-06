import { historyDatabase, prisma } from "@/lib/prisma";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { createThread } from "./create_thread";
import { section } from "@/http/controllers/social-assistant/enums/Section";
import { initializeThread } from "./initialize_thread";
import { runThread } from "./run_thread";
import * as fs from 'fs';
import { calculateAge } from "@/utils/calculate-age";

export async function runApplicationAnalysis(application_id: string) {
    const application = await prisma.application.findUniqueOrThrow({
        where: { id: application_id }
    })

    const candidateOrResponsibleHDB = await SelectCandidateResponsibleHDB(application_id);
    
    if (!candidateOrResponsibleHDB) {
        throw new Error("Candidate or responsible not found");
    }

    const familyMembers = await historyDatabase.familyMember.findMany({
        where: { application_id }
    })
    const membersIds = familyMembers.map((member) => member.id);


    await UserMemberDataAnalysis(candidateOrResponsibleHDB.UserData.id,application.id);

    for (const member_id of membersIds) {
        await memberDataAnalysis(member_id,application.id);
    }
}

const FamilyMembersections = [
    'statement',
    'income',
    "registrato",
    'pix',
    'family-member',
    'declaracoes'
] as section[]

async function memberDataAnalysis(member_id: string, application_id: string) {

    console.log(`Analyzing member ${member_id}`);
    const familyMember = await historyDatabase.familyMember.findUniqueOrThrow({
        where: { id: member_id }
    })
    const memberAge = calculateAge(familyMember.birthDate);
    for (const section of FamilyMembersections) {

        if ((section === "registrato" || section === 'pix') && memberAge < 18) {
            continue;
        
        }
        if (section === 'health' && !familyMember.hasSevereDeseaseOrUsesMedication) {
            continue;
        }
        if (section === 'statement' && !familyMember.hasBankAccount) {
            continue;
        }

        let table_id = null;
        if (section === 'income') {
            const income = await historyDatabase.familyMemberIncome.findMany({
                where: { application_id, OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }] }
            });
            for (const incomeData of income) {
                table_id = incomeData.id;

                await createThread(application_id, section, member_id, table_id);
                await initializeThread(application_id, section, member_id, table_id);

                await runThread(application_id, section, member_id, table_id);

            }
        }

        else {
            
            await createThread(application_id, section, member_id, table_id);
            await initializeThread(application_id, section, member_id, table_id);

            await runThread(application_id, section, member_id, table_id);

        }
    }


}
const candidateOrResponsibleSections = [
    'statement',
    'income',
    "registrato",
   'pix',
    'identity',
    'declaracoes'

] as section[]
async function UserMemberDataAnalysis(member_id: string, application_id: string) {

    console.log(`Analyzing member ${member_id}`);


    const member = await historyDatabase.identityDetails.findUniqueOrThrow({
        where: {application_id}
    })
    for (const section of candidateOrResponsibleSections) {
        if (section === 'health' && !member.hasSevereDeseaseOrUsesMedication) {
            continue;
        }
        if (section === 'statement' && !member.hasBankAccount) {
            continue;
        }
        let table_id = null;
        if (section === 'income') {
            const income = await historyDatabase.familyMemberIncome.findMany({
                where: { application_id, OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }] }
            });
            for (const incomeData of income) {
                table_id = incomeData.id;

               
                await createThread(application_id, section, member_id, table_id);
                await initializeThread(application_id, section, member_id, table_id);

                await runThread(application_id, section, member_id, table_id);

            }
        } else {
           
            await createThread(application_id, section, member_id, table_id);
            await initializeThread(application_id, section, member_id, table_id);

            await runThread(application_id, section, member_id, table_id);

        }
    }


}