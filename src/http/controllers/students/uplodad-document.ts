import { APIError } from "@/errors/api-error";
import { uploadFile } from "@/http/services/upload-file";
import { prisma } from "@/lib/prisma";
import { MultipartFile } from "@fastify/multipart";
import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { z } from "zod";
import { MAX_FILE_SIZE } from "../candidates/AWS Routes/upload-documents";

export default async function uploadStudentDocument(request: FastifyRequest, response: FastifyReply) {
    try {
        const schema = z.object({
            student_id: z.string()
        })
        const { error, data } = schema.safeParse(request.params)
        if (error) {
            throw new APIError('Dados incorretos')
        }
        const { student_id } = data
        const parts = request.parts({ limits: { fileSize: MAX_FILE_SIZE } });

        const files: (MultipartFile & { fileBuffer: any, metadata: object })[] = []
        let metadatas: any = {};
        // get all metadata and files separated
        await new Promise<void>(async (resolve, reject) => {

            for await (const part of parts) {
                if (part.fieldname === 'file_metadatas' && part.type === "field") {
                    metadatas = JSON.parse(part.value as string)
                }
                if (part.type === "file") {
                    // read the file before sending to AWS, need to ensure the data needed for file store isn't lost during the process
                    const chunks: any[] = [];
                    let fileSize = 0;

                    part.file.on('data', (chunk) => {
                        fileSize += chunk.length;
                        chunks.push(chunk);
                    });
                    part.file.on('end', async () => {
                        if (fileSize >= MAX_FILE_SIZE) {
                            // if it exceeds 10Mb, throw an error before manipulating it
                            reject(new APIError('Arquivo excedente ao limite de 10MB'));
                        }
                        const fileBuffer = Buffer.concat(chunks)
                        // // if part is file, save to files array to consume after
                        files.push({
                            ...part,
                            fileBuffer,
                            metadata: metadatas?.[`metadata_${part.fieldname}`] ?? {}
                        })
                    })
                }
            }
            resolve()
        })

        await prisma.$transaction(async (tPrisma) => {

            for (const file of files) {
                const fileName = `${file.fieldname}${path.extname(file.filename)}`
                const filePath = `StudentDocuments/${student_id}/${fileName}`
                await uploadFile(file.fileBuffer, filePath, file.metadata)
                await tPrisma.studentDocuments.create({
                    data: {
                        metadata: file.metadata,
                        path: filePath,
                        student_id: student_id,
                        documentName: fileName,

                    }
                })
            }
        })
        return response.status(201).send({ message: 'Arquivos criados' })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}