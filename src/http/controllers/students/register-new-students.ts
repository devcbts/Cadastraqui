import { APIError } from "@/errors/api-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import getDelimiter from "@/utils/get-csv-delimiter";
import { AllEducationType, AllScholarshipsType, EducationStyle, ROLE, StudentImportBatchStatus, StudentImportItemStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import csv from 'csv-parser';
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { decodeStream, encodeStream } from "iconv-lite";
import { detect } from "jschardet";
import pump from "pump";
import tmp from 'tmp';
import { z } from "zod";
import { SHIFT } from "../candidates/enums/Shift";
import { normalizeString } from "../entities/utils/normalize-string";
import SelectEntityOrDirector from "../entities/utils/select-entity-or-director";
import sendEmail from "@/http/services/send-email";

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
        Periodo: z.string().transform(e => {
            const v = (e ?? '').toString().trim()
            if (v === '') return null
            const n = parseInt(v)
            return Number.isNaN(n) ? null : n
        }).nullable(),
        Nascimento: z.string().transform(e => {
            const [day, month, year] = (e ?? '').split('/').map(e => parseInt(e))
            return new Date(year, (isNaN(month) ? 1 : month) - 1, day)
        }),
        // IdCurso: z.string().transform(e => parseInt(e)).nullish(),
        CNPJ: z.string(),
        isPartial: z.string().transform(e => Boolean(parseInt(e))),
        Turno: SHIFT,
        ScholarshipType: z.enum(Object.values(AllScholarshipsType) as [string, ...string[]]),
        ModalityType: z.enum(Object.values(EducationStyle) as [string, ...string[]]),
        RName: z.string().nullish(),
        RCPF: z.string().transform(e => e.replace(/\D*/g, '')).nullish(),
        RBirthDate: z.string().nullish().transform(e => {
            if (!e) { return null }
            const [day, month, year] = e.split('/').map(e => parseInt(e))
            return new Date(year, (isNaN(month) ? 1 : month) - 1, day)
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
    type ParsedCSVData = CSVData & {
        lineNumber: number,
        rawData: Record<string, any>,
        entityId?: string
    }
    type CSVRegisterData = ParsedCSVData & {
        responsible?: {
            Email: string,
            CPF: string,
            Nascimento: Date,
            Nome: string,
            candidates?: ParsedCSVData[]
        }
    }
    let importBatchId: string | null = null
    let totalRows = 0
    let processedRows = 0
    let successRows = 0
    let errorRows = 0
    try {
        const { sub, role } = request.user
        const { user_id } = await SelectEntityOrDirector(sub, role)

        const csvData: CSVRegisterData[] = []
        const parseErrors: { lineNumber: number, rawData: Record<string, any>, errorMessage: string, candidateCpf?: string, candidateEmail?: string }[] = []
        const csvFile = await request.file();
        if (!csvFile) {
            throw new ResourceNotFoundError();
        }

        const entity = await prisma.entity.findUnique({
            where: { user_id: user_id },
            select: {
                id: true,
                CNPJ: true,
                EntitySubsidiary: { select: { id: true, CNPJ: true } }
            }
        })

        if (!entity) {
            throw new APIError('Entidade não encontrada')
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

        // const detectedEncoding = await detectEncoding(tempFile.name);
        // const encoding = detectedEncoding === 'windows-1251' ? 'latin1' : (detectedEncoding as string || 'utf8');
        const separator = await getDelimiter(tempFile.name)
        const importBatch = await prisma.studentImportBatch.create({
            data: {
                fileName: (csvFile as any).filename ?? null,
                delimiter: separator,
                status: StudentImportBatchStatus.PROCESSING,
                createdByUserId: sub,
                entity_id: entity.id,
            }
        })
        importBatchId = importBatch.id

        let rowIndex = 0
        await new Promise((resolve, reject) => {
            fs.createReadStream(tempFile.name)
                // .pipe(decodeStream(encoding))
                // .pipe(encodeStream('utf8'))
                .pipe(csv({ separator: separator }))
                .on('data', (data: any) => {
                    const isEmpty = Object.values(data).every((e: any) => !e?.toString())
                    console.log('CSV row', rowIndex + 1, data)
                    if (isEmpty) {
                        rowIndex++
                        return
                    }

                    totalRows++
                    const result = csvSchema.safeParse(data)
                    if (!result.success) {
                        const errorMessage = result.error.issues
                            .map(issue => {
                                const issuePath = issue.path?.length ? issue.path.join('.') : 'linha'
                                return `${issuePath}: ${issue.message}`
                            })
                            .join('; ')
                        parseErrors.push({
                            lineNumber: rowIndex + 1,
                            rawData: data,
                            errorMessage,
                            candidateCpf: data?.CPF?.toString().replace(/\D*/g, ''),
                            candidateEmail: data?.Email?.toString(),
                        })
                        errorRows++
                        processedRows++
                        rowIndex++
                        return
                    }
                    const parsedData: ParsedCSVData = {
                        ...result.data,
                        lineNumber: rowIndex + 1,
                        rawData: data,
                    }
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
                    rowIndex++
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
        let usersToSendEmail: { name: string, email: string }[] = []
        const studentsCreatedFromCSV: ParsedCSVData[] = []

        if (parseErrors.length > 0) {
            await prisma.studentImportBatchItem.createMany({
                data: parseErrors.map(error => ({
                    batch_id: importBatchId!,
                    lineNumber: error.lineNumber,
                    status: StudentImportItemStatus.ERROR,
                    errorMessage: error.errorMessage,
                    rawData: error.rawData,
                    candidateCpf: error.candidateCpf,
                    candidateEmail: error.candidateEmail,
                }))
            })
        }

        const normalizedEntityCnpj = entity.CNPJ.replace(/\D*/g, '')
        for (const rowData of csvData) {
            const candidates = rowData.responsible?.candidates ?? [rowData]
            const rowRole = (rowData.hasResponsible ? ROLE.RESPONSIBLE : ROLE.CANDIDATE)

            for (const candidate of candidates) {
                try {
                    await prisma.$transaction(async (tPrisma) => {
                        const normalizedCandidateCnpj = candidate.CNPJ.replace(/\D*/g, '')
                        const isEntity = normalizedCandidateCnpj === normalizedEntityCnpj
                        const entityId = isEntity
                            ? entity.id
                            : entity.EntitySubsidiary.find(i => i.CNPJ.replace(/\D*/g, '') === normalizedCandidateCnpj)?.id

                        if (!entityId) {
                            throw new APIError('CNPJ não pertence à entidade do usuário autenticado')
                        }

                        const userAlreadyExists = rowData.hasResponsible
                            ? await tPrisma.legalResponsible.findFirst({
                                where: { CPF: rowData.RCPF?.replace(/\D*/g, '') }
                            })
                            : await tPrisma.candidate.findFirst({
                                where: { CPF: candidate.CPF.replace(/\D*/g, '') }
                            })

                        let currentUserId: string | undefined = userAlreadyExists?.user_id ?? undefined
                        let currentResponsibleId: string | undefined = userAlreadyExists?.id

                        if (!userAlreadyExists) {
                            const password_hash = await hash(rowData.responsible?.CPF?.replace(/\D*/g, '') ?? candidate.CPF.replace(/\D*/g, ''), 6)
                            const { id: userId } = await tPrisma.user.create({
                                data: {
                                    role: rowRole,
                                    email: rowData.responsible?.Email ?? candidate.Email,
                                    password: password_hash,
                                }
                            })
                            usersToSendEmail.push({
                                name: rowData.responsible?.Nome ?? candidate.Nome,
                                email: rowData.responsible?.Email ?? candidate.Email,
                            })
                            currentUserId = userId

                            if (rowData.hasResponsible) {
                                const { id: responsibleId } = await tPrisma.legalResponsible.create({
                                    data: {
                                        birthDate: rowData.responsible?.Nascimento!,
                                        name: rowData.responsible?.Nome!,
                                        CPF: rowData.responsible?.CPF!,
                                        role: "RESPONSIBLE",
                                        user_id: userId,
                                    }
                                })
                                currentResponsibleId = responsibleId
                            }
                        }

                        const candidateExists = await tPrisma.candidate.findFirst({
                            where: { CPF: candidate.CPF.replace(/\D*/g, '') }
                        })

                        let candidateId = candidateExists?.id
                        if (!candidateExists) {
                            if (!currentUserId && !currentResponsibleId) {
                                throw new APIError('Não foi possível associar usuário/responsável ao candidato')
                            }

                            const createdCandidate = await tPrisma.candidate.create({
                                data: {
                                    birthDate: candidate.Nascimento,
                                    name: candidate.Nome,
                                    CPF: candidate.CPF,
                                    role: "CANDIDATE",
                                    ...(!rowData.responsible
                                        ? { user_id: currentUserId }
                                        : { responsible_id: currentResponsibleId })
                                    ,
                                    email: candidate.Email,
                                }
                            })
                            candidateId = createdCandidate.id
                        }

                        let course = await tPrisma.course.findFirst({
                            where: { AND: [{ normalizedName: normalizeString(candidate.Curso) }, { Type: candidate.CourseType as AllEducationType }] }
                        })

                        let entityCourse = await tPrisma.entityCourse.findFirst({
                            where: {
                                AND: [
                                    { course: { AND: [{ normalizedName: normalizeString(candidate.Curso) }, { Type: candidate.CourseType as AllEducationType }] } },
                                    { OR: [{ entity_id: entityId }, { entitySubsidiary_id: entityId }] }
                                ]
                            }
                        })

                        if (!entityCourse) {
                            let courseId: number
                            if (course) {
                                courseId = course.id
                            } else {
                                const existingCourse = await tPrisma.course.create({
                                    data: {
                                        name: candidate.Curso,
                                        normalizedName: normalizeString(candidate.Curso),
                                        Type: candidate.CourseType as AllEducationType,
                                    }
                                })
                                courseId = existingCourse.id
                            }

                            entityCourse = await tPrisma.entityCourse.create({
                                data: {
                                    course_id: courseId,
                                    ...(isEntity ? { entity_id: entityId } : { entitySubsidiary_id: entityId })
                                }
                            })
                        }

                        const date = new Date()
                        const deadline = new Date(date.getFullYear() + 1, date.getMonth() + 1, date.getDate())
                        const student = await tPrisma.student.create({
                            data: {
                                name: candidate.Nome,
                                entityCourse_id: entityCourse.id,
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

                        await tPrisma.studentImportBatchItem.create({
                            data: {
                                batch_id: importBatchId!,
                                lineNumber: candidate.lineNumber,
                                status: StudentImportItemStatus.CREATED,
                                rawData: candidate.rawData,
                                candidateCpf: candidate.CPF,
                                candidateEmail: candidate.Email,
                                candidate_id: candidateId,
                                student_id: student.id,
                            }
                        })

                        studentsCreatedFromCSV.push(candidate)
                        successRows++
                    })
                } catch (err) {
                    await prisma.studentImportBatchItem.create({
                        data: {
                            batch_id: importBatchId!,
                            lineNumber: candidate.lineNumber,
                            status: StudentImportItemStatus.ERROR,
                            errorMessage: err instanceof Error ? err.message : 'Erro inesperado ao cadastrar aluno',
                            rawData: candidate.rawData,
                            candidateCpf: candidate.CPF,
                            candidateEmail: candidate.Email,
                        }
                    })
                    errorRows++
                } finally {
                    processedRows++
                }
            }
        }

        const importStatus = successRows === 0 && errorRows > 0
            ? StudentImportBatchStatus.FAILED
            : errorRows > 0
                ? StudentImportBatchStatus.PARTIAL
                : StudentImportBatchStatus.SUCCESS

        await prisma.studentImportBatch.update({
            where: { id: importBatchId! },
            data: {
                status: importStatus,
                totalRows,
                processedRows,
                successRows,
                errorRows,
                finishedAt: new Date(),
            }
        })

        Promise.all(usersToSendEmail.map(async x => {
            return await sendEmail({
                to: x.email,
                subject: 'Conta CadastrAqui',
                body: `
                <h1>Você foi registrado no CadastrAqui</h1>
                <strong>Olá ${x.name},</strong>
                <p>
                sua conta já está ativa no <a href="https://www.cadastraqui.com.br" target="_blank">CadastrAqui</a>. Para utilizá-la, acesse com 
                este e-mail e utilize os dígitos do seu CPF como senha no primeiro acesso.
                </p>
                <p>
                Depois basta completar seu cadastro para acompanhamento da instituição!
                </p>
                `
            })
        })).catch(err => console.log('EMAIL PARA ESTUDANTES CADASTRADOS', err))

        return response.status(201).send({
            batchId: importBatchId,
            status: importStatus,
            summary: {
                totalRows,
                processedRows,
                successRows,
                errorRows,
            },
            students: studentsCreatedFromCSV,
        })
    } catch (err) {
        if (importBatchId) {
            const failedStatus = successRows > 0 ? StudentImportBatchStatus.PARTIAL : StudentImportBatchStatus.FAILED
            await prisma.studentImportBatch.update({
                where: { id: importBatchId },
                data: {
                    status: failedStatus,
                    totalRows,
                    processedRows,
                    successRows,
                    errorRows,
                    finishedAt: new Date(),
                }
            }).catch(() => null)
        }
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        console.log(err)
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}