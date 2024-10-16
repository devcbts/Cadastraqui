import { APIError } from "@/errors/api-error";
import { uploadFile } from "@/http/services/upload-file";
import { prisma } from "@/lib/prisma";
import { SCHOLARSHIP_GRANTED_STATUS } from "@/utils/enums/zod/scholarship-granted";
import { MultipartFile } from "@fastify/multipart";
import { EducationStyle } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MAX_FILE_SIZE } from "../../candidates/AWS Routes/upload-documents";

export default async function updateScholarshipStatus(
    request: FastifyRequest,
    response: FastifyReply
) {
    const paramsSchema = z.object({
        scholarship_id: z.string()
    })
    const bodySchema = z.object({
        status: SCHOLARSHIP_GRANTED_STATUS,
        education_style: z.string().nullish()
    })
    // const formSchema = z.object({
    //     status: SCHOLARSHIP_GRANTED_STATUS,
    //     education_style: z.string()
    // })
    try {
        let metadatas: any = {};
        let bodyData: typeof bodySchema._type;
        let files: (MultipartFile & { fileBuffer: any, metadata: object })[] = [];
        if (request.headers["content-type"] !== "application/json") {
            // If content-type is JSON, it means we do not have any file on form
            // meaning that the current status (should not) won't be 'REGISTERED'
            // if content-type is form-data, it means we need to parse the formdata correctly into bodySchema (form-data "data" property)
            const parts = request.parts({ limits: { fileSize: MAX_FILE_SIZE } });

            // get all metadata and files separated
            for await (const part of parts) {
                if (part.fieldname === "data" && part.type === "field") {
                    const { data, error } = bodySchema.safeParse(JSON.parse(part.value as string) as typeof bodySchema._type)
                    if (error || !data.education_style) {
                        throw new APIError('Campos inválidos')
                    }
                    bodyData = data
                }
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
                            throw new Error('Arquivo excedente ao limite de 10MB');
                        }
                        const fileBuffer = Buffer.concat(chunks)
                        console.log(metadatas)
                        // // if part is file, save to files array to consume after
                        files.push({
                            ...part,
                            fileBuffer,
                            metadata: metadatas?.[`metadata_${part.fieldname.split('_')[1]}`] ?? {}
                        })
                    })
                }
            }
        } else {
            const { data, error } = bodySchema.safeParse(request.body)
            if (!!error) {
                throw new APIError('Status inválido')
            }
            bodyData = data
        }

        const { scholarship_id } = paramsSchema.parse(request.params)

        const scholarship = await prisma.scholarshipGranted.findUnique({
            where: { id: scholarship_id },
            include: {
                application: {
                    include: {
                        EducationLevel: true
                    }
                }
            }
        })
        if (!scholarship) {
            throw new APIError('Bolsista não encontrado')
        }
        if (scholarship.status !== "SELECTED") {
            throw new APIError('Esta bolsa já teve seu status modificado e não pode ser alterado novamente')
        }
        await prisma.$transaction(async (tPrisma) => {

            if (bodyData.status === 'REGISTERED') {


                let entityCourse = await tPrisma.entityCourse.findFirst({
                    where: {
                        course_id: scholarship.application.EducationLevel.courseId,
                        OR: [{ entity_id: scholarship.application.EducationLevel.entityId }, { entitySubsidiary_id: scholarship.application.EducationLevel.entitySubsidiaryId }]
                    }
                })

                if (!entityCourse) {
                    entityCourse = await tPrisma.entityCourse.create({
                        data: {
                            course_id: scholarship.application.EducationLevel.courseId,
                            entity_id: scholarship.application.EducationLevel.entityId,
                            entitySubsidiary_id: scholarship.application.EducationLevel.entitySubsidiaryId
                        }
                    })
                }
                const student = await tPrisma.student.create({
                    data: {
                        announcement_id: scholarship.application.announcement_id,
                        name: scholarship.application.candidateName,
                        admissionDate: new Date(),
                        scholarshipType: scholarship.application.EducationLevel.typeOfScholarship,
                        isPartial: scholarship.application.ScholarshipPartial!,
                        candidate_id: scholarship.application.candidate_id,
                        shift: scholarship.application.EducationLevel.shift,
                        semester: scholarship.application.EducationLevel.semester,
                        status: 'Active',
                        educationStyle: bodyData.education_style as EducationStyle,
                        entityCourse_id: entityCourse.id,


                    }
                })
                for (const part of files) {
                    const route = `StudentDocuments/${student.id}/${part.fieldname.split('_')[1]}.${part.mimetype.split('/')[1]}`;
                    await tPrisma.studentDocuments.create({
                        data: {
                            student_id: student.id,
                            path: route,
                            documentName: part.filename,
                            metadata: part.metadata
                        }
                    })
                    await uploadFile(part.fileBuffer, route, part.metadata)
                }
            }

            await tPrisma.scholarshipGranted.update({
                where: { id: scholarship_id },
                data: {
                    status: bodyData.status
                }
            })
        })
        return response.status(204).send()
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        console.log(err)
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}