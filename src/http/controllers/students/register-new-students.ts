import { APIError } from "@/errors/api-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import getDelimiter from "@/utils/get-csv-delimiter";
import { AllEducationType, AllScholarshipsType, EducationStyle, ROLE } from "@prisma/client";
import { hash } from "bcryptjs";
import chardet from 'chardet';
import csv from 'csv-parser';
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { decodeStream, encodeStream } from "iconv-lite";
import pump from "pump";
import tmp from 'tmp';
import { z } from "zod";
import { SHIFT } from "../candidates/enums/Shift";
import { normalizeString } from "../entities/utils/normalize-string";
import SelectEntityOrDirector from "../entities/utils/select-entity-or-director";
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
        CPF: z.string().transform(e => e.replace(/\D*/g, '')),
        Periodo: z.string().transform(e => parseInt(e)),
        Nascimento: z.string().transform(e => {
            const [day, month, year] = e.split('/').map(e => parseInt(e))
            return new Date(year, month, day)
        }),
        // IdCurso: z.string().transform(e => parseInt(e)).nullish(),
        CNPJ: z.string().transform(normalizeString),
        isPartial: z.string().transform(e => Boolean(parseInt(e))),
        Turno: SHIFT,
        ScholarshipType: z.enum(Object.values(AllScholarshipsType) as [string, ...string[]]),
        ModalityType: z.enum(Object.values(EducationStyle) as [string, ...string[]]),
        RName: z.string().nullish(),
        RCPF: z.string().transform(e => e.replace(/\D*/g, '')).nullish(),
        RBirthDate: z.string().nullish().transform(e => {
            if (!e) { return null }
            const [day, month, year] = e.split('/').map(e => parseInt(e))
            return new Date(year, month, day)
        }),
        REmail: z.string().nullish(),
        hasResponsible: z.string().transform(e => Boolean(parseInt(e))).nullish()

    }).superRefine((data, ctx) => {
        if (data.hasResponsible) {

            if (
                !data.RCPF ||
                !data.RName ||
                !data.REmail ||
                !data.RBirthDate
            ) {
                ctx.addIssue({
                    message: 'Dados do responsável incompletos',
                    path: ["hasResponsible"],
                    code: "custom"
                })
            }
        }
    })
    type CSVData = z.infer<typeof csvSchema>
    try {
        const { sub, role } = request.user
        const { user_id } = await SelectEntityOrDirector(sub, role)

        const csvData: (CSVData & {
            responsible?: {
                Email: string,
                CPF: string,
                Nascimento: Date,
                Nome: string,
                candidates?: (CSVData & { entityId?: string })[]
            },
        })[] = []
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
        const encoding = chardet.detectFileSync(tempFile.name)
        const separator = await getDelimiter(tempFile.name)
        await new Promise((resolve, reject) => {
            fs.createReadStream(tempFile.name)
                .pipe(decodeStream(encoding ?? 'utf-8'))
                .pipe(encodeStream('utf8'))
                .pipe(csv({ separator: separator }))
                .on('data', (data: CSVData) => {
                    const isEmpty = Object.values(data).every(e => !e?.toString())
                    if (isEmpty) {
                        return
                    }
                    // Process the data as needed
                    const { error, data: parsedData, success } = csvSchema.safeParse(data)
                    console.log(data)
                    if (error) {
                        console.log(error)
                        reject(new APIError(`Dados inválidos`))
                    }
                    if (success) {
                        if (!parsedData.hasResponsible) {
                            csvData.push(parsedData);
                        } else {
                            const currResponsible = csvData.find(e => e.responsible?.CPF === parsedData.RCPF)
                            const currCandidates = currResponsible?.responsible?.candidates ?? []
                            currCandidates.push(parsedData)
                            if (!currResponsible) {

                                const responsible = {
                                    CPF: parsedData.RCPF!,
                                    Nascimento: parsedData.RBirthDate!,
                                    Nome: parsedData.RName!,
                                    Email: parsedData.REmail!,
                                    candidates: currCandidates
                                }
                                csvData.push({
                                    ...parsedData,
                                    responsible
                                })
                            }


                        }
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
                where: { user_id: user_id },
                select: {
                    id: true,
                    normalizedCnpj: true,
                    EntitySubsidiary: { select: { id: true, normalizedCnpj: true } }
                }
            })

            const dataToRegister = csvData.filter(e => {
                return entity?.normalizedCnpj === normalizeString(e.CNPJ) || entity?.EntitySubsidiary.find(i => i.normalizedCnpj === normalizeString(e.CNPJ))

            }).map(e => {
                const isEntity = e.CNPJ.replace(/\D*/g, '') === entity?.normalizedCnpj
                const entityId = isEntity ? entity.id : entity?.EntitySubsidiary.find(i => i.normalizedCnpj === e.CNPJ.replace(/\D*/g, ''))!.id
                const isResponsible = e.hasResponsible ?? false
                if (isResponsible) {

                    e.responsible!.candidates = e.responsible?.candidates?.map(e => {
                        const entityId = isEntity ? entity.id : entity?.EntitySubsidiary.find(i => i.normalizedCnpj === e.CNPJ.replace(/\D*/g, ''))!.id
                        return { ...e, entityId }
                    })
                }
                return ({
                    ...e,
                    role: isResponsible ? ROLE.RESPONSIBLE : ROLE.CANDIDATE,
                    isEntity,
                    entityId
                })
            }
            )
            console.log('DATA', csvData)
            await Promise.all(
                dataToRegister.map(async e => {
                    // check if responsible or candidate being registered already exists
                    const userAlreadyExists = e.hasResponsible ? await tPrisma.legalResponsible.findFirst({
                        where: { CPF: e.RCPF?.replace(/\D*/g, '') }
                    })
                        : await tPrisma.candidate.findFirst({
                            where: { CPF: e.CPF.replace(/\D*/g, '') }
                        })
                    let id = userAlreadyExists?.user_id;
                    let respId = userAlreadyExists?.id;
                    // if responsible/candidate exists, skip user/responsible/candidate creation on db
                    if (!userAlreadyExists) {
                        const password_hash = await hash(e.responsible?.CPF ?? e.CPF.replace(/\D*/g, ''), 6)

                        const { id: userId } = await tPrisma.user.create({
                            data: {
                                role: e.role,
                                email: e.responsible?.Email ?? e.Email,
                                password: password_hash
                            }
                        })
                        id = userId
                        if (e.hasResponsible) {
                            const { id: responsibleId } = await tPrisma.legalResponsible.create({
                                data: {
                                    birthDate: e.responsible?.Nascimento!,
                                    name: e.responsible?.Nome!,
                                    CPF: e.responsible?.CPF!,
                                    role: "RESPONSIBLE",
                                    user_id: id,
                                }
                            })
                            respId = responsibleId
                        }
                    }
                    for (const candidate of e.responsible?.candidates ?? [e]) {
                        let candidateId
                        // Checks again only for existing candidates with the same cpf,
                        // if candidate exists, skip candidate creation on db and get current candidate ID to use as FK
                        const candidateExists = await tPrisma.candidate.findFirst({
                            where: { CPF: candidate.CPF.replace(/\D*/g, '') }
                        })
                        candidateId = candidateExists?.id
                        if (!candidateExists) {

                            const createdCandidate = await tPrisma.candidate.create({
                                data: {
                                    birthDate: candidate.Nascimento,
                                    name: candidate.Nome,
                                    CPF: candidate.CPF,
                                    role: "CANDIDATE",

                                    ...(!e.responsible ? { user_id: id }
                                        : { responsible_id: respId })
                                    ,
                                    email: candidate.Email,
                                }
                            })
                            candidateId = createdCandidate.id
                        }
                        console.log('CANDIDATE', candidateExists)
                        let course = await tPrisma.course.findFirst({
                            where: { AND: [{ normalizedName: normalizeString(candidate.Curso) }, { Type: candidate.CourseType as AllEducationType }] }
                        })
                        let entityCourse = await tPrisma.entityCourse.findFirst({
                            where: { AND: [{ course: { AND: [{ normalizedName: normalizeString(candidate.Curso) }, { Type: candidate.CourseType as AllEducationType }] } }, { OR: [{ entity_id: candidate.entityId }, { entitySubsidiary_id: candidate.entityId }] }] }
                        })
                        // if (e.IdCurso !== null && e.IdCurso !== undefined) {
                        if (!entityCourse) {
                            let id;
                            if (course) {
                                id = course.id
                            } else {

                                const existingCourse = await tPrisma.course.create({
                                    data: {
                                        name: e.Curso,
                                        normalizedName: normalizeString(e.Curso),
                                        Type: e.CourseType as AllEducationType,

                                    }
                                })
                                id = existingCourse.id
                            }
                            entityCourse = await tPrisma.entityCourse.create({
                                data: {
                                    course_id: id,
                                    ...(e.isEntity ? { entity_id: e.entityId } : { entitySubsidiary_id: e.entityId })
                                }
                            })
                        }
                        const date = new Date()
                        const deadline = new Date(date.getFullYear() + 1, date.getMonth() + 1, date.getDate())
                        await tPrisma.student.create({
                            data: {
                                name: candidate.Nome,
                                entityCourse_id: entityCourse!.id,
                                admissionDate: date,
                                scholarshipDeadline: deadline,
                                announcement_id: '',
                                candidate_id: candidateId!,
                                scholarshipType: candidate.ScholarshipType as AllScholarshipsType,
                                shift: candidate.Turno,
                                status: 'Active',
                                isPartial: candidate.isPartial,
                                educationStyle: candidate.ModalityType as EducationStyle,
                                cameFromCSV: true,
                            }
                        })
                    }

                }))
        })
        return response.status(201).send({
            students: csvData.flatMap(e => {
                if (e.hasResponsible) {
                    return e.responsible?.candidates
                }
                return e
            })
        })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        console.log(err)
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}