import { APIError } from "@/errors/api-error";
import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { AllEducationType, AllScholarshipsType, SHIFT } from "@prisma/client";
import csv from 'csv-parser';
import { FastifyReply, FastifyRequest } from "fastify";
import fs from 'fs';
import { decodeStream, encodeStream } from "iconv-lite";
import { detect } from 'jschardet';
import pump from "pump";
import tmp from 'tmp';
import { EntityNotExistsErrorWithCNPJ } from '../../../errors/entity-not-exists-with-cnpj';
import SelectEntityOrDirector from "./utils/select-entity-or-director";

interface CSVData {
    "CNPJ (Matriz ou Filial)": string;
    "Tipo de Educação": string;
    "Ciclo/Ano/Série/Curso": string;
    "Turno": string;
    "Tipo de Bolsa": string;
    "Número de Vagas": string;
}
const educationTypeMapping: { [key: string]: string } = {
    "Pré-Escola": AllEducationType.Preschool,
    "Fundamental I e II": AllEducationType.Elementary,
    "Ensino Médio": AllEducationType.HighSchool,
    "Educação Profissional": AllEducationType.ProfessionalEducation
};

const shiftMapping: { [key: string]: string } = {
    "Matutino": SHIFT.Matutino,
    "Vespertino": SHIFT.Vespertino,
    "Noturno": SHIFT.Noturno,
    "Integral": SHIFT.Integral
}

const scholarshipTypeMapping: { [key: string]: string } = {
    "Bolsa Lei 187 Parcial": AllScholarshipsType.Law187ScholarshipPartial,
    "Bolsa Lei 187 Integral": AllScholarshipsType.Law187Scholarship,
    "Estudante com Deficiência Parcial": AllScholarshipsType.StudentWithDisabilityPartial,
    "Estudante com Deficiência Integral": AllScholarshipsType.StudentWithDisability,
    "Tempo Integral (Parcial)": AllScholarshipsType.FullTimePartial,
    "Tempo Integral (Integral)": AllScholarshipsType.FullTime,
    "Trabalhadores da Entidade Parcial": AllScholarshipsType.EntityWorkersPartial,
    "Trabalhadores da Entidade Integral": AllScholarshipsType.EntityWorkers
};
export default async function uploadBasicEducationCSVFileToAnnouncement(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user_id = request.user.sub
        const role = request.user.role

        const entity = await SelectEntityOrDirector(user_id, role)
       
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
        const results: CSVData[] = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(tempFile.name)
                .pipe(decodeStream(encoding))
                .pipe(encodeStream('utf8'))
                .pipe(csv({ separator: detectedEncoding === "UTF-8" ? ',' : ';' }))
                .on('data', (data: CSVData) => {
                    // Process the data as needed
                    results.push(data);
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


        const uniqueCNPJs = Array.from(new Set(results.map(result => result["CNPJ (Matriz ou Filial)"])));

        const entities = await Promise.all(uniqueCNPJs.map(async (cnpj) => {
            let entityOrSubsidiary

            entityOrSubsidiary = await prisma.entity.findUnique({
                where: {
                    CNPJ: cnpj,
                    id: entity.id
                }

            }) || await prisma.entitySubsidiary.findUnique({
                where: {
                    CNPJ: cnpj,
                    entity_id: entity.id
                }
            });
            if (!entityOrSubsidiary) {
                throw new EntityNotExistsErrorWithCNPJ(cnpj);
            }
            return entityOrSubsidiary;
        }))
        if (results.some(e => {
            const value = parseInt(e["Número de Vagas"])
            return isNaN(value) || value <= 0
        })) {
            throw new APIError('Não podem haver vagas iguais à zero.')
        }
        const csvDataFormated = results.map((result: CSVData) => {
            const matchedEntity = entities.find(entity => entity.CNPJ === result["CNPJ (Matriz ou Filial)"]);
            return {
                // cnpj: result["CNPJ (Matriz ou Filial)"],
                basicEduType: educationTypeMapping[result["Tipo de Educação"]],
                availableCourses: result["Ciclo/Ano/Série/Curso"],
                shift: result["Turno"],
                scholarshipType: scholarshipTypeMapping[result["Tipo de Bolsa"]],
                verifiedScholarships: parseInt(result["Número de Vagas"]),
                entity_subsidiary_id: matchedEntity?.id === entity.id ? null : matchedEntity?.id
            };
        });

        return reply.status(200).send({ csvDataFormated });

    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message });
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof EntityNotExistsErrorWithCNPJ) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof APIError) {
            return reply.status(400).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error.' });
    }
}