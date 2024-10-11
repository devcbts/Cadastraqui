import { APIError } from "@/errors/api-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { AllEducationType } from "@prisma/client";
import { hash } from "bcryptjs";
import csv from 'csv-parser';
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { decodeStream, encodeStream } from "iconv-lite";
import { detect } from "jschardet";
import pump from "pump";
import tmp from 'tmp';
import { z } from "zod";
import { normalizeString } from "../utils/normalize-string";

export default async function registerNewStudents(
    request: FastifyRequest,
    response: FastifyReply
) {
    const csvSchema = z.object({
        Nome: z.string(),
        Curso: z.string(),
        Tipo: z.string(),
        CourseType: z.string(),
        Email: z.string().email(),
        CPF: z.string(),
        Periodo: z.string(),
        Nascimento: z.string().transform(e => new Date(e)),
        // IdCurso: z.string().transform(e => parseInt(e)).nullish(),
        CNPJ: z.string()
    })
    type CSVData = z.infer<typeof csvSchema>
    try {
        const { sub } = request.user
        const csvData: CSVData[] = []
        const csvFile = await request.file();
        if (!csvFile) {
            throw new ResourceNotFoundError();
        }

        // Create a temporary file
        const tempFile = tmp.fileSync({ postfix: '.csv' });

        // Save the uploaded file to the temporary file
        await new Promise((resolve, reject) => {
            pump(csvFile.file, fs.createWriteStream(tempFile.name), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        });
        const detectEncoding = (filePath: any) => {
            return new Promise((resolve, reject) => {
                const buffer = fs.readFileSync(filePath);
                const detection = detect(buffer);
                resolve(detection.encoding);
            });
        };

        const detectedEncoding = await detectEncoding(tempFile.name);
        const encoding = detectedEncoding === 'windows-1251' ? 'latin1' : (detectedEncoding as string || 'utf8');
        await new Promise((resolve, reject) => {
            fs.createReadStream(tempFile.name)
                .pipe(decodeStream(encoding))
                .pipe(encodeStream('utf8'))
                .pipe(csv({ separator: detectedEncoding === "UTF-8" ? ',' : ';' }))
                .on('data', (data: CSVData) => {
                    const isEmpty = Object.values(data).every(e => !e.toString())
                    if (isEmpty) { return }
                    // Process the data as needed
                    const { error, data: parsedData, success } = csvSchema.safeParse(data)
                    if (error) {
                        reject(new APIError(`Dados inválidos no arquivo ${JSON.stringify(data)}`))
                    }
                    if (success) {
                        csvData.push(parsedData);
                    }
                })
                .on('end', () => {
                    // Delete the temporary file
                    fs.unlink(tempFile.name, (err) => {
                        if (err) {
                            console.error('Failed to delete temporary file:', err);
                        }
                    });
                    resolve(null);
                })
                .on('error', (err: any) => {
                    reject(err);
                });
        });
        await prisma.$transaction(async (tPrisma) => {
            // find all entities/subsidiaries
            const entity = await tPrisma.entity.findUnique({
                where: { user_id: sub },
                select: {
                    id: true,
                    CNPJ: true,
                    EntitySubsidiary: { select: { id: true, CNPJ: true } }
                }
            })

            const dataToRegister = csvData.filter(e => {
                return entity?.CNPJ === e.CNPJ || entity?.EntitySubsidiary.find(i => i.CNPJ === e.CNPJ)

            }).map(e => {
                const isEntity = e.CNPJ.replace(/\D*/g, '') === entity?.CNPJ.replace(/\D*/g, '')
                const entityId = isEntity ? entity.id : entity?.EntitySubsidiary.find(i => i.CNPJ.replace(/\D*/g, '') === e.CNPJ.replace(/\D*/g, ''))!.id
                return ({
                    ...e,
                    isEntity,
                    entityId
                })
            }
            )
            await Promise.all(dataToRegister.map(async e => {
                const password_hash = await hash(e.CPF.replace(/\D*/g, ''), 6)
                const { id } = await tPrisma.user.create({
                    data: {
                        role: "CANDIDATE",
                        email: e.Email,
                        password: password_hash
                    }
                })
                const { id: candidateId } = await tPrisma.candidate.create({
                    data: {
                        birthDate: e.Nascimento,
                        name: e.Nome,
                        CPF: e.CPF,
                        role: "CANDIDATE",
                        user_id: id,
                        email: e.Email,
                    }
                })
                let course = await tPrisma.entityCourse.findFirst({
                    where: { AND: [{ course: { AND: [{ normalizedName: normalizeString(e.Curso) }, { Type: e.CourseType as AllEducationType }] } }, { OR: [{ entity_id: e.entityId }, { entitySubsidiary_id: e.entityId }] }] }
                })
                // if (e.IdCurso !== null && e.IdCurso !== undefined) {
                if (!course) {
                    const { id } = await tPrisma.course.create({
                        data: {
                            name: e.Curso,
                            normalizedName: normalizeString(e.Curso),
                            Type: e.CourseType as AllEducationType,

                        }
                    })
                    course = await tPrisma.entityCourse.create({
                        data: {
                            course_id: id,
                            ...(e.isEntity ? { entity_id: e.entityId } : { entitySubsidiary_id: e.entityId })
                        }
                    })
                }
                await tPrisma.student.create({
                    data: {
                        name: e.Nome,
                        entityCourse_id: course!.id,
                        admissionDate: new Date(),
                        announcement_id: '',
                        candidate_id: candidateId,
                        scholarshipType: 'CityGovernment',
                        shift: 'Integral',
                        status: 'Active',
                        isPartial: false,
                        educationStyle: 'Presential',
                    }
                })
            }))
        })
        return response.status(201).send({ students: csvData })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}