import { FastifyReply, FastifyRequest } from "fastify";
import { openAi } from "@/lib/openAi";
import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument } from "pdf-lib";
import { MultipartFile } from "@fastify/multipart";
import { z } from "zod";
import { CacheManager } from "../students/CacheManager";

const cacheManager = new CacheManager(1000, 20);
export const MAX_FILE_SIZE = 1024 * 1024 * 10;

export async function handleFileUpload(request: FastifyRequest, reply: FastifyReply) {
  const parts = request.parts({ limits: { fileSize: MAX_FILE_SIZE } });

  const files: (MultipartFile & { fileBuffer: any, metadata: object })[] = [];
  let metadatas: any = {};
  let nome: string | undefined;
  let tries = 0;
  let hasCache = false;
  let uuid;
  try {
    for await (const part of parts) {
      if (part.fieldname === 'file_metadatas' && part.type === "field") {
        metadatas = JSON.parse(part.value as string);
      }
      if (part.fieldname === 'nome' && part.type === "field") {
        nome = part.value as string;
      }
      if (part.fieldname === 'tries' && part.type === "field") {
        tries = parseInt(part.value as string);
      }
      if (part.fieldname === 'id' && part.type === "field") {
        uuid = part.value as string;
        if (cacheManager.hasCache(uuid)) {
          hasCache = true;
          const cachedData: {
            legibilidade: boolean,
            retifiedReceiver: boolean,
            grossAmount: string,
            netIncome: string,
            coherent: boolean,
            tries: number
          } | null | undefined = cacheManager.getCache(uuid);
          if (cachedData !== null && cachedData !== undefined && (cachedData.legibilidade && cachedData.retifiedReceiver && cachedData.coherent)) {

            return reply.status(200).send({ data: cachedData, id: uuid });
          }
        }
      }
      if (part.type === "file") {
        const chunks: any[] = [];
        let fileSize = 0;

        part.file.on('data', (chunk) => {
          fileSize += chunk.length;
          chunks.push(chunk);
        });

        part.file.on('end', async () => {
          if (fileSize >= MAX_FILE_SIZE) {
            throw new Error('Arquivo excedente ao limite de 10MB');
          }
          const fileBuffer = Buffer.concat(chunks);
          files.push({
            ...part,
            fileBuffer,
            metadata: metadatas?.[`metadata_${part.fieldname.split('_')[1]}`] ?? {}
          });
        });
      }
    }
    if (!nome) {
      throw new Error('Campo "nome" é obrigatório');
    }
    const myThread = await openAi.beta.threads.create();

    const fileIds = [];
    for (const part of files) {
      const filePath = path.join(__dirname, part.filename);
      await fs.promises.writeFile(filePath, part.fileBuffer);

      const fileId = await processFile(filePath);
      fileIds.push(fileId);

      await fs.promises.unlink(filePath); // Remove o arquivo temporário
    }
    console.log(fileIds)
    const attachments = fileIds.map(fileId => ({
      file_id: fileId,
      tools: [{ type: "file_search" as const }],
    }));

    const objectToSend = {
      nome: nome
    };
    console.log(objectToSend);

    const myMessage = await openAi.beta.threads.messages.create(
      myThread.id,
      {
        role: "user",
        content: JSON.stringify(objectToSend), // Converte o objeto para uma string JSON
        attachments: attachments,
      }
    );
    console.log("message sent:", myMessage);
    await openAi.beta.threads.runs.createAndPoll(
      myThread.id,
      {
        assistant_id: "asst_rcQO8gwbdGud2MraQlDUCg98",
      }
    );

    const response = await openAi.beta.threads.messages.list(myThread.id);
    const parsedResponse: {
      legibilidade: boolean,
      retifiedReceiver: boolean,
      grossAmount: string,
      netIncome: string,
      coherent: boolean,
    } | null | undefined = parseAIResponse(response);
    if (!hasCache || !uuid) {

      uuid = myThread.id;
    }


    if (parsedResponse && (!parsedResponse.legibilidade || !parsedResponse.retifiedReceiver || !parsedResponse.coherent)) {
      tries += 1;
    }

    cacheManager.setCache(uuid, { ...parsedResponse, tries });

    return reply.status(200).send({ data: parsedResponse, id: uuid });
  } catch (error: any) {
    console.error("Error:", error.message);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

async function processFile(filePath: string) {
  const existingPdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(new Uint8Array(existingPdfBytes));
  const totalPages = pdfDoc.getPageCount();

  let fileToSendPath = filePath;

  if (totalPages >= 4) {
    const newPdfDoc = await PDFDocument.create();
    const [firstPage, secondPage, thirdPage, fourthPage] = await newPdfDoc.copyPages(pdfDoc, [0, 1, 2, 3]);

    newPdfDoc.addPage(firstPage);
    newPdfDoc.addPage(secondPage);
    newPdfDoc.addPage(thirdPage);
    newPdfDoc.addPage(fourthPage);

    const newPdfBytes = await newPdfDoc.save();
    const tempOutputPath = path.resolve(__dirname, 'temp_output_' + path.basename(filePath) + '.pdf');
    fs.writeFileSync(tempOutputPath, newPdfBytes);

    fileToSendPath = tempOutputPath;
  }

  const file = fs.createReadStream(fileToSendPath);
  const myFile = await openAi.files.create({
    file: file,
    purpose: "assistants",
  });

  if (fileToSendPath !== filePath) {
    fs.unlinkSync(fileToSendPath);
  }

  return myFile.id;
}

function parseAIResponse(response: any) {
  const aiMessage = response.data.find((message: any) => message.role === 'assistant');
  if (!aiMessage) {
    return null;
  }
  let parsedContent;
  try {
    const content = aiMessage.content[0].text.value;

    // Extrair o JSON entre o primeiro "{" e o último "}"
    const jsonString = content.substring(content.indexOf("{"), content.lastIndexOf("}") + 1);
    console.log(jsonString);
    parsedContent = JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing AI response content:", error);
    return null;
  }
  return parsedContent;
}