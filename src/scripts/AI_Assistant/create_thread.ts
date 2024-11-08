import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { openAi } from "@/lib/openAi";
import { section, toDbSection } from "@/http/controllers/social-assistant/enums/Section";

// Função para criar uma thread na API da OpenAI e registrar no banco de dados

const sectionAssistants: Record<section, string> = {
    identity: 'asst_h1OkBCMH8GvXv59pRSQlR7Ls',
    'family-member': 'asst_0bbnWComOXAJcr9dWysDnfMG',
    income: 'asst_c6t6a1UxMAEXjur8lP0aqrI8',
    health: 'asst_ALj8oIuw2S9TmcB6XE32clIQ',
    statement: 'asst_wcKTHhH4aC5g2RcMuZSg612U',
    housing: "",
    "monthly-income": "",
    bank: "",
    registrato: "asst_iYagLf2cDxh7Z1EKTjfOLFvc",
    medication: "",
    vehicle: "",
    expenses: "",
    declaracoes: "asst_wWLtrRGhaJjXYtZyZLxCqdga",
    pix: "asst_M9MRKeOIMab4kngjuD9b89g2"
};
export async function createThread(application_id: string, sectionToFind: section, member_id: string, table_id: string | null) {
    try {
        const application = await prisma.application.findUnique({
            where: { id: application_id }
        });
        if (!application) {
            throw new Error("Application not found");
        }

        const myThread = await openAi.beta.threads.create();

        // Criar uma thread na API da OpenAI e registrar no banco de dados
        await prisma.aIAssistant.upsert({
            where : {application_id_section_member_table: {application_id, section: toDbSection(sectionToFind), member_id, table_id: table_id ?? ""}},
            create: {
                thread_id: myThread.id,
                application_id: application_id,
                AIassistant_id: sectionAssistants[sectionToFind],
                section: toDbSection(sectionToFind),
                member_id,
                table_id: table_id ?? ""
            },
            update: {
                thread_id: myThread.id
            }
        });

        console.log("Thread created successfully");
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}