import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { openAi } from "@/lib/openAi";
import { $Enums, AIAssistantStatus } from '@prisma/client';
import { section, toDbSection } from "@/http/controllers/social-assistant/enums/Section";
import { MessagesPage } from "openai/resources/beta/threads/messages";
import { stat } from "fs";

// Função para rodar uma thread na API da OpenAI e obter as mensagens
export async function runThread(application_id: string, sectionToFind: section, member_id: string, table_id: string | null) {
    try {
        const application = await prisma.application.findUnique({
            where: { id: application_id }
        });
        if (!application) {
            throw new Error("Application not found");
        }

        const AiAssistant = await prisma.aIAssistant.findUniqueOrThrow({
            where: { application_id_section_member_table: { application_id, section: toDbSection(sectionToFind), member_id, table_id: table_id ?? "" } }
        });

        const myRun = await openAi.beta.threads.runs.createAndPoll(
            AiAssistant.thread_id,
            {
                assistant_id: AiAssistant.AIassistant_id,
            }
        );

        const myMessages = await openAi.beta.threads.messages.list(AiAssistant.thread_id);
        const wait = (ms: number) => {
            const start = new Date().getTime();
            let end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        };
        const { inconsistencies, status, content } = extractAIResponse(myMessages);
        await prisma.aIAssistant.update({
            where: { id: AiAssistant.id },
            data: {
                inconsistences: inconsistencies,
                status: status,
                analysis: content
            }
        })
        wait(5000);
        return { myMessages };
    } catch (error: any) {
        console.error("Error:", error.message);
        throw error;
    }
}



function extractAIResponse(MessagesPage: MessagesPage) {
    const aiMessage = MessagesPage.data.find((message) => message.role === 'assistant');

    if (!aiMessage) {
       return { inconsistencies: 0, status: AIAssistantStatus.INCONCLUSIVE, content: '' };
    }

    const content = aiMessage.content[0].type === 'text' ? aiMessage.content[0].text.value : '';

    const inconsistenciesMatch = content.match(/\*\*Número de inconsistências\*\*: (\d+)/) || content.match(/\*\*Número de inconsistências:\*\* (\d+)/);
    const statusMatch = content.match(/\*\*Status da Análise\*\*:.*?(Conclusiva|Inconclusiva)/i) || content.match(/\*\*Status da análise:\*\*.*?(Conclusiva|Inconclusiva)/i);
    
    console.log(inconsistenciesMatch);
    console.log(statusMatch);
    const inconsistencies = inconsistenciesMatch ? parseInt(inconsistenciesMatch[1], 10) : 0;
    const findedStatus = statusMatch ? statusMatch[1] : "Inconclusiva";
    let status;
    
    if (findedStatus === "Conclusiva" || findedStatus === "Conclusivo") {
        status = AIAssistantStatus.CONCLUSIVE;


    }
    else {
        status = AIAssistantStatus.INCONCLUSIVE;
    }


    return { inconsistencies, status, content };
}